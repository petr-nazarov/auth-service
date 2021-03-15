import * as mongoose from 'mongoose';

// interfaces

export default class DataBaseRepository {
  referenceModel: mongoose.Model<mongoose.Document<any>>;
  allowedFieldsToFilter: Array<string>;

  constructor(referenceModel: any, allowedFieldsToFilter: Array<string>) {
    this.referenceModel = referenceModel;
    this.allowedFieldsToFilter = allowedFieldsToFilter;
  }

  async getFilterQuery(requestData: any, _allowedFieldsToFilter: any) {
    const allowedFieldsToFilter = _allowedFieldsToFilter;
    let filterQuery = {};
    for (let key of allowedFieldsToFilter) {
      if (requestData[key]) {
        let queryString;
        let queryKey;
        if (key.indexOf('_like') > 1) {
          queryKey = key.replace('_like', '');
          queryString = new RegExp(requestData[key], 'i');
        } else {
          queryKey = key;
          queryString = requestData[key];
        }
        filterQuery = {
          ...filterQuery,
          [queryKey]: queryString,
        };
      }
    }
    return filterQuery;
  }

  getLimitQuery(requestData: any) {
    const perPage = parseInt(requestData.perPage);
    return perPage;
  }

  getSkipQuery(requestData: any) {
    const perPage = parseInt(requestData.perPage);
    const page = parseInt(requestData.page || 1);

    return perPage * (page - 1);
  }

  async find(filterData: any) {
    const filter = await this.getFilterQuery(filterData, this.allowedFieldsToFilter);
    const limit = this.getLimitQuery(filterData);
    const skip = this.getSkipQuery(filterData);
    const sortField = filterData.sortField || 'id';
    const sortOrder = filterData.sortOrder || 'asc';

    const data = await this.referenceModel
      .find(filter)
      .sort([[sortField, sortOrder]])
      .limit(limit)
      .skip(skip);

    const total = await this.referenceModel.countDocuments(filter);
    const perPage = filterData.perPage || null;
    const page = filterData.page || 1;
    const meta = {
      total,
      perPage,
      page,
      sortField,
      sortOrder,
    };

    const result = {
      data,
      meta,
    };
    return result;
  }

  async findRaw(filter: any): Promise<Array<any>> {
    const data = await this.referenceModel.find(filter);
    return data;
  }
  async findFirstRaw(filter: any): Promise<any> {
    const array = await this.findRaw(filter);
    if (array.length < 1) {
      throw {
        name: 'ObjectNotFoundInCollection',
        message: `Object with not found in collection ${this.referenceModel.collection.name} on method findFirstRaw()`,
      };
    }
    return array[0];
  }

  async findOneOrNull(filter: any): Promise<any | null> {
    const obj = await this.referenceModel.findOne(filter);
    if (obj) {
      return obj;
    }
    return null;
  }

  async show(id: string): Promise<any> {
    const obj = await this.referenceModel.findById(id);
    if (obj) {
      return obj;
    }
    throw {
      name: 'ObjectNotFoundInCollection',
      message: `Object with id ${id} not found in collection ${this.referenceModel.collection.name} on method show()`,
    };
  }

  async create(data: any): Promise<any> {
    const obj = new this.referenceModel(data);
    const result = await obj.save();
    return result;
  }

  async update(id: string, data: any): Promise<any> {
    const obj = await this.referenceModel.findById(id);
    if (obj) {
      Object.assign(obj, data);
      await obj.save();
      return obj;
    }
    throw {
      name: 'ObjectNotFoundInCollection',
      message: `Object with id ${id} not found in collection ${this.referenceModel.collection.name} on method update()`,
    };
  }
  async delete(id: string): Promise<any> {
    const obj = await this.referenceModel.findById(id);
    if (obj) {
      await obj.delete();
      return;
    }
    throw {
      name: 'ObjectNotFoundInCollection',
      message: `Object with id ${id} not found in collection ${this.referenceModel.collection.name} on method update()`,
    };
  }

  async bulkCreate(data: Array<any>): Promise<Array<any>> {
    const objects = await this.referenceModel.insertMany(data);
    return objects;
  }

  async bulkUpdate(data: any): Promise<Array<any>> {
    const bulk = this.referenceModel.collection.initializeUnorderedBulkOp();
    const idStack = [];
    for (const el of data) {
      const id = el._id;
      delete el._id;
      idStack.push(mongoose.Types.ObjectId(id));

      bulk.find({ _id: mongoose.Types.ObjectId(id) }).update({ $set: el });
    }

    const bulkResult = await bulk.execute();

    if (bulkResult.nMatched != data.length || bulkResult.ok != true) {
      throw {
        name: 'BulkOperationMismatch',
        message: `An error occurred in bulk operation in bulkUpdate() for collection ${this.referenceModel.collection.name}`,
        details: bulkResult,
      };
    }

    const updatedDocuments = await this.referenceModel.find({ _id: { $in: idStack } });
    return updatedDocuments;
  }

  async bulkDelete(data: Array<string>) {
    const ids = data.map((el) => mongoose.Types.ObjectId(el));
    const result = await this.referenceModel.deleteMany({ _id: { $in: ids } });
    return result;
  }
}
