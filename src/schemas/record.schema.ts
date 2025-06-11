import * as yup from 'yup';

export const RecordCreateSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().optional()
});

export const paginationSchema = yup.object({
  page: yup.number().min(1).default(1),
  pageSize: yup.number().min(1).max(200).default(10),
  query: yup.object()
});
