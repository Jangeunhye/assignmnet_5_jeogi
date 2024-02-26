import { customAlphabet } from 'nanoid';
const RANDOM_ID_BASE =
  '01234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

const generateRandomId = customAlphabet(RANDOM_ID_BASE, 20);
export default generateRandomId;
