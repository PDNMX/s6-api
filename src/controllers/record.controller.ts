import { Request, Response } from 'express';
import { paginationSchema } from '../schemas/record.schema';
import RecordModel from '../models/record.model';

class RecordController {
  static queryString = (cadena: String) => {
    cadena = cadena
      .toLowerCase()
      .replace('ñ', '#')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/a/g, '[a,á,à,ä]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/#/g, 'ñ');

    return { $regex: cadena, $options: 'i' };
  };

  static prepareQuery(query: any) {
    // console.log('query: ', query);

    let nQuery = {};

    if (query?.ocid && query?.ocid !== '') {
      nQuery = { ...nQuery, ['ocid']: this.queryString(query?.ocid) };
    }

    if (query?.awards?.title && query?.awards?.title !== '') {
      nQuery = { ...nQuery, ['record.awards.title']: this.queryString(query?.awards?.title) };
    }

    if (query?.awards?.status && query?.awards?.status !== '') {
      nQuery = { ...nQuery, ['record.awards.status']: this.queryString(query?.awards?.status) };
    }

    if (query?.awards?.suppliers?.name && query?.awards?.suppliers?.name !== '') {
      nQuery = { ...nQuery, ['record.awards.suppliers.name']: this.queryString(query?.awards?.suppliers?.name) };
    }

    if (query?.awards?.items?.description && query?.awards?.items?.description !== '') {
      nQuery = { ...nQuery, ['record.awards.items.description']: this.queryString(query?.awards?.items?.description) };
    }

    if (query?.buyer?.name && query?.buyer?.name !== '') {
      nQuery = { ...nQuery, ['record.buyer.name']: this.queryString(query?.buyer?.name) };
    }

    if (query?.contracts?.title && query?.contracts?.title !== '') {
      nQuery = { ...nQuery, ['record.contracts.title']: this.queryString(query?.contracts?.title) };
    }

    if (query?.tender?.title && query?.tender?.title !== '') {
      nQuery = { ...nQuery, ['record.tender.title']: this.queryString(query?.tender?.title) };
    }

    if (query?.tender?.procurementMethod && query?.tender?.procurementMethod !== '') {
      nQuery = { ...nQuery, ['record.tender.procurementMethod']: this.queryString(query?.tender?.procurementMethod) };
    }

    if (query?.tender?.tenderPeriod?.startDate && query?.tender?.tenderPeriod?.startDate !== '') {
      nQuery = { ...nQuery, ['record.tender.tenderPeriod.startDate']: { $gte: query?.tender?.tenderPeriod?.startDate } };
    }

    if (query?.tender?.tenderPeriod?.endDate && query?.tender?.tenderPeriod?.endDate !== '') {
      nQuery = { ...nQuery, ['record.tender.tenderPeriod.endDate']: { $lte: query?.tender?.tenderPeriod?.endDate } };
    }

    if (query?.tender?.items?.description && query?.tender?.items?.description !== '') {
      nQuery = { ...nQuery, ['record.tender.items.description']: this.queryString(query?.tender?.items?.description) };
    }

    if (query?.parties?.name && query?.parties?.name !== '') {
      nQuery = { ...nQuery, ['record.parties.name']: this.queryString(query?.parties?.name) };
    }

    if (query?.parties?.roles && query?.parties?.roles !== '') {
      nQuery = { ...nQuery, ['record.parties.roles']: { $in: [query?.parties?.roles] } };
    }

    // console.log('nQuery: ', nQuery);

    return nQuery;
  }
  static queryRecords = async (req: Request, res: Response) => {
    try {
      const { page, pageSize, query } = await paginationSchema.validate(req.body);

      const nQuery = this.prepareQuery(query);

      const totalRows = await RecordModel.countDocuments(nQuery);

      const skip = { $skip: (page - 1) * pageSize };
      const limit = { $limit: pageSize };
      const records = await RecordModel.aggregate([{ $match: nQuery }, { $project: { _id: 0 } }, skip, limit]);

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
