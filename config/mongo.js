import mongoose from 'mongoose';
if (process.env.MONGO_DB_LOG == 'true') {
    mongoose.connect(`mongodb://${process.env.MONGO_DB_HOST || '127.0.0.1'}:${process.env.MONGO_DB_PORT || '27017'}/${process.env.MONGO_DB_COLLECTION}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Fail to connect MONGODB:'));
    db.once('open', function () {
        console.log('\x1b[32m', 'Mongo DB connected', '\x1b[0m');
    });
}
const FlexibleModel = mongoose.model('event-logs', new mongoose.Schema({}, { strict: false }));

export const insertDocument = async (document) => {
    try {
        const doc = new FlexibleModel(document);
        await doc.save();
    } catch (error) {
        console.error('Error inserting document:', error);
    }
};

export const getAllFilterData = async (payload) => {
    try {
        const { level, method, ip, path, user, status, from, to} = payload;
        const data = {
            path: [],
            status: [],
            method: [],
            level: [],
            // ip: [],
        }
        const query = {};
         
        const fields = [
           { field: 'level', value: level },
           { field: 'method', value: method },
        //    { field: 'ip', value: ip },
           { field: 'path', value: path, parser: String },
           { field: 'user', value: user },
           { field: 'status', value: status, parser: Number }
       ];
       fields.forEach(({ field, value, parser = (v) => v }) => {
           if (value) query[field] = parser(value);
       });
       if ((from !== null && from !== undefined) || (to !== null && to !== undefined)) {
        query.timestamp = {};
        if (from) {
            const fromDate = new Date(from);
            fromDate.setHours(0, 0, 0, 0); // Set to start of the day
            query.timestamp.$gte = fromDate;
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999); // Set to end of the day
            query.timestamp.$lte = toDate;
        }
    }
        // data.path = await FlexibleModel.distinct('path',query);
        // data.status = await FlexibleModel.distinct('status',query);
        // data.method = await FlexibleModel.distinct('method',query);
        // data.level = await FlexibleModel.distinct('level',query);
        // data.ip = await FlexibleModel.distinct('ip',query);
        return data;
    } catch (error) {
        console.error('Error retrieving document:', error);
        throw new Error(error);
    }
 };