import { Request, Response } from 'express';
import { paginationSchema } from '../schemas/record.schema';
import RecordModel, { group, projection } from '../models/record.model';

class RecordController {
  static queryRecords = async (req: Request, res: Response) => {
    try {
      const { page, pageSize } = await paginationSchema.validate(req.body);

      const totalRows = await RecordModel.countDocuments();

      const skip = { $skip: (page - 1) * pageSize };
      const limit = { $limit: pageSize };
      // const records = await RecordModel.aggregate([{ $project: { _id: 0 } }, group, skip, limit, { $project: projection }]);
      const records = await RecordModel.aggregate([{ $project: { _id: 0 } }, skip, limit]);

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
