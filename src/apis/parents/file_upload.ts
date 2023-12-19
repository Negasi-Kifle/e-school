import multer from 'multer';

export const upload= multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});