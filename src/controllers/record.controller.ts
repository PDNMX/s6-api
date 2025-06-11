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
    const { ocid, awards, buyer, contracts, tender, parties } = query;
    let nQuery = {};

    if (ocid && ocid !== '') {
      nQuery = { ...nQuery, ['ocid']: this.queryString(ocid) };
    }

    if (awards?.title && awards?.title !== '') {
      nQuery = { ...nQuery, ['record.awards.title']: this.queryString(awards?.title) };
    }

    if (awards?.status && awards?.status !== '') {
      nQuery = { ...nQuery, ['record.awards.status']: this.queryString(awards?.status) };
    }

    if (awards?.suppliers?.name && awards?.suppliers?.name !== '') {
      nQuery = { ...nQuery, ['record.awards.suppliers.name']: this.queryString(awards?.suppliers?.name) };
    }

    if (awards?.items?.description && awards?.items?.description !== '') {
      nQuery = { ...nQuery, ['record.awards.items.description']: this.queryString(awards?.items?.description) };
    }

    if (buyer?.name && buyer?.name !== '') {
      nQuery = { ...nQuery, ['record.buyer.name']: this.queryString(buyer?.name) };
    }

    if (contracts?.title && contracts?.title !== '') {
      nQuery = { ...nQuery, ['record.contracts.title']: this.queryString(contracts?.title) };
    }

    if (tender?.title && tender?.title !== '') {
      nQuery = { ...nQuery, ['record.tender.title']: this.queryString(tender?.title) };
    }

    if (tender?.procurementMethod && tender?.procurementMethod !== '') {
      nQuery = { ...nQuery, ['record.tender.procurementMethod']: this.queryString(tender?.procurementMethod) };
    }

    if (tender?.tenderPeriod?.startDate && tender?.tenderPeriod?.startDate !== '') {
      nQuery = { ...nQuery, ['record.tender.tenderPeriod.startDate']: { $gte: tender?.tenderPeriod?.startDate } };
    }

    if (tender?.tenderPeriod?.endDate && tender?.tenderPeriod?.endDate !== '') {
      nQuery = { ...nQuery, ['record.tender.tenderPeriod.endDate']: { $lte: tender?.tenderPeriod?.endDate } };
    }

    if (tender?.items?.description && tender?.items?.description !== '') {
      nQuery = { ...nQuery, ['record.tender.items.description']: this.queryString(tender?.items?.description) };
    }

    if (parties?.name && parties?.name !== '') {
      nQuery = { ...nQuery, ['record.parties.name']: this.queryString(parties?.name) };
    }

    if (parties?.roles && parties?.roles !== '') {
      nQuery = { ...nQuery, ['record.parties.roles']: { $in: [parties?.roles] } };
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
