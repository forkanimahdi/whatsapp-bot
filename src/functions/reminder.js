module.exports = async function reminder(message, client) {
    const messageBody = message.body.trim();
    
    const dayRegex = /\/day (\d{2}-\d{2}-\d{4})/; // Matches /day DD-MM-YYYY
    const timeRegex = /\/time (\d{2}:\d{2})/; // Matches /time HH:MM
    const messageRegex = /\/message (.+)/; // Matches /message <reminder message>

    const dayMatch = messageBody.match(dayRegex);
    const timeMatch = messageBody.match(timeRegex);
    const reminderMessageMatch = messageBody.match(messageRegex);

    // If /message is not provided, send a warning and exit
    if (!reminderMessageMatch) {
        client.sendMessage(message.from, "⚠️ You must provide a /message to set a reminder. Example: /message Don't forget the meeting.");
        return;
    }

    const reminderMessage = reminderMessageMatch[1];
    let targetTime = new Date();
    let responseMessage = "Reminder set for ";

    // If both /day and /time are provided
    if (dayMatch && timeMatch) {
        const [day, month, year] = dayMatch[1].split("-");
        const [hours, minutes] = timeMatch[1].split(":");
        targetTime.setDate(day);
        targetTime.setMonth(month - 1); // JavaScript months are 0-based
        targetTime.setFullYear(year);
        targetTime.setHours(hours);
        targetTime.setMinutes(minutes);
        targetTime.setSeconds(0);
        targetTime.setMilliseconds(0);
        responseMessage += `${dayMatch[1]} at ${timeMatch[1]}`;
    }
    // If only /time is provided, set the reminder for today at the given time
    else if (timeMatch) {
        const [hours, minutes] = timeMatch[1].split(":");
        targetTime.setHours(hours);
        targetTime.setMinutes(minutes);
        targetTime.setSeconds(0);
        targetTime.setMilliseconds(0);
        responseMessage += `today at ${timeMatch[1]}`;
    }
    // If only /day is provided, set the reminder for the given day at 00:00
    else if (dayMatch) {
        const [day, month, year] = dayMatch[1].split("-");
        targetTime.setDate(day);
        targetTime.setMonth(month - 1); // JavaScript months are 0-based
        targetTime.setFullYear(year);
        targetTime.setHours(0);
        targetTime.setMinutes(0);
        targetTime.setSeconds(0);
        targetTime.setMilliseconds(0);
        responseMessage += `${dayMatch[1]} at 00:00`;
    }
    // If neither /day nor /time is provided, send a message asking for them
    else {
        client.sendMessage(message.from, "⚠️ You must provide either /day or /time to set a reminder.");
        return;
    }

    const now = new Date();
    const delay = targetTime.getTime() - now.getTime();

    // If the target time is in the past, set the reminder for the next occurrence
    if (delay < 0) {
        client.sendMessage(message.from, "⚠️ The specified time is in the past. Please provide a future time.");
        return;
    }

    const userName = message._data.notifyName || message.from; // Get user's name or fallback to their phone number
    
    setTimeout(() => {
        client.sendMessage(message.from, `Hi ${userName}, you have a reminder now : ${reminderMessage}`);
    }, delay);

    // Confirm the reminder
    client.sendMessage(message.from, `Hi ${userName}, your reminder has been set for : "${reminderMessage}".`);
};
