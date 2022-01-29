import { connect } from 'mongoose';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PWD } = process.env;

export default function () {
    return connect(`mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}