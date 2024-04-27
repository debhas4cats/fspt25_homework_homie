const EMPTY_STATE = "It seems like there's nothing here.";
const DUE_NEXT_DAY = "Don't forget - your {assignment} is due tomorrow!";
const DUE_TODAY = "Guess what? You've got something to do today!";
const LATE = "Oh no - you're late! Hurry and submit your {assignment}!";

const createMessage = (homework) => {
  if (!homework || !Array.isArray(homework) || homework.length === 0) {
    return [EMPTY_STATE];
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Check if there's any assignment due today, tomorrow, or late
  const dueToday = homework.some(item => item && item.due_date && new Date(item.due_date).toDateString() === today.toDateString());
  const dueTomorrow = homework.some(item => item && item.due_date && new Date(item.due_date).toDateString() === tomorrow.toDateString());
  const late = homework.some(item => item && item.due_date && new Date(item.due_date) < today);

  if (dueToday) {
    return [DUE_TODAY];
  } else if (dueTomorrow) {
    return [DUE_NEXT_DAY.replace("{assignment}", homework[0].assignment)];
  } else if (late) {
    return [LATE.replace("{assignment}", homework[0].assignment)];
  } else {
    return ["Get ready! Your assignments are approaching."];
  }
};

export default createMessage;
