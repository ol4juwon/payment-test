"use strict";

class Repository {
    constructor(Model) {
        this.Model = Model;
    }

    getModel() {
        return this.Model;
    }

    findOneNative(condition = {}) {
        return this.Model.findOne(condition);
    }

    create(payload = {}) {
        return this.Model.create(payload);
    }

    findById(id) {
        return this.Model.findById(id);
    }

    truncate(condition = {}) {
        // return this.Model.deleteMany(condition);
        if (process.env.NODE_ENV === "development") {
            return this.Model.deleteMany(condition);
        }
    }

    deleteMany(condition = {}) {
        return this.Model.deleteMany(condition);
    }

    findOne(condition = {}, sort = {}) {
        return this.Model.findOne(condition).sort(sort);
    };

    all(condition = {}, sort ="desc", orderBy = "createdAt",page = null, limit = 100) {
        logger.info( { page, limit:limit, sort: sort , order: orderBy})
        const sortBy ={[orderBy]: sort === 'asc' ? 1:-1}
        console.log({sort})
        if (page) {

            delete condition.page;
            delete condition.limit;
            return this.Model.paginate(condition, { page, limit:parseInt(limit.toString()),sort: sortBy });
        }
        console.log("The query ism ", condition);
        return this.Model.find(condition).sort(sortBy);
    };
    /**
     @param condition
     @param sortBy
     @param page
     The search function search for documents with paginating them
     */
    search(condition = {}, sortBy={}){
        return this.Model.find(condition).sort(sortBy);
    }


    count(condition = {}) {
        return this.Model.find(condition).countDocuments();
    }

    massInsert(data = []) {
        if (data.length === 0)
            return [];

        return this.Model.insertMany(data);
    }

    async findOrCreate(options = {}, defaults = {}) {
        const model = await this.findOne(options);
        if (!model)
            return this.create({ ...options, ...defaults });
        return model;
    }


    findOneAndUpdate(condition, obj) {
        return this.Model.findOneAndUpdate(condition, obj, { upsert: true, setDefaultsOnInsert: true, new: true });
    }

    update(condition, obj) {
        return this.Model.updateMany(condition, obj);
    }

}

module.exports = Repository;