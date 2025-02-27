export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) {
    return false;
  }
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};
