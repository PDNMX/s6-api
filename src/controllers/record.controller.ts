import { Request, Response } from 'express';
import { paginationSchema } from '../schemas/record.schema';
import RecordModel, { projection } from '../models/record.model';

class RecordController {
  static queryRecords = async (req: Request, res: Response) => {
    try {
      const { page, pageSize } = await paginationSchema.validate(req.query);

      const totalRows = await RecordModel.countDocuments();
      //   const records = await RecordModel.find()
      //     .select(projection)
      //     .skip((page - 1) * pageSize)
      //     .limit(pageSize);

      const records = await RecordModel.find();
      console.log('records: ', records);

      return res.json({
        pagination: {
          page,
          pageSize,
          totalRows,
          hasNextPage: page * pageSize < totalRows
        },
        results: records
      });
    } catch (error: any) {
      return res.status(500).json({
        code: 'SERVER_001',
        message: 'Internal server error',
        additionalInfo: error.message
      });
    }
  };
}

export default RecordController;
