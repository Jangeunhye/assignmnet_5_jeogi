export function parseCheckedInAtToDate(checkedInAt: string): Date {
  // // "2024-02-25-11:20" 형식을 Date로 변환
  const parts = checkedInAt.split('-');
  const datePart = parts.slice(0, 3).join('-');
  const timePart = parts[3];
  const dateTimeString = `${datePart}T${timePart}:00`;
  return new Date(dateTimeString);
}
