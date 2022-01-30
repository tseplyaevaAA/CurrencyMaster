import { openDatabase } from 'react-native-sqlite-storage';
import { CREATE_CURRENCY_TABLE, currencyInsertCommand, fetchCurrencyByType, FETCH_ALL_DATA_CURRENCY_TABLE, REMOVE_OLD_VALUES, } from './DatabaseQueries';

export const getDBConnection = async () => {
    return openDatabase({ name: 'CurrencyDatabase.db', location: 'default' });
};

const FILE_NAME = 'DatabaseAccessor:';

class DatabaseAccessor {

    async createTable() {
        console.log(FILE_NAME, ' createTable method called')
        try {
            const db = await getDBConnection();
            await db.executeSql(CREATE_CURRENCY_TABLE);
        } catch (error) {
            console.log(FILE_NAME, ' error happened: ', error)
        }
    }

    async fetchCurrenciesFromDB() {
        console.log(FILE_NAME, ' fetchCurrenciesFromDB method called')
        let result = [];
        const db = await getDBConnection();
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(FETCH_ALL_DATA_CURRENCY_TABLE, [], (tx, results) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        result.push(row)
                    }
                    resolve(result);
                }, (error) => {
                    console.log(FILE_NAME, ' error happened: ', error)
                    reject([]);
                });
            })
        })
    }

    async fetchCurrenciesByTypeFromDB(type) {
        console.log(FILE_NAME, ' fetchCurrenciesByTypeFromDB method called')
        let result = [];
        const db = await getDBConnection();
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(fetchCurrencyByType(type), [], (tx, results) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        result.push(row)
                    }
                    resolve(result);
                }, (error) => {
                    console.log(FILE_NAME, ' error happened: ', error)
                    reject([]);
                });
            })
        })
    }

    async insertValueToDB(value) {
        console.log(FILE_NAME, ' insertValueToDB method called')
        try {
            const db = await getDBConnection();
            await db.transaction((tx) => {
                tx.executeSql(currencyInsertCommand(value), [], (tx, results) => {
                    console.log("insertValueToDB query completed");
                })
            })
        } catch (error) {
            console.log(FILE_NAME, ' error happened: ', error)
        }
    }

    async removeOldValues() {
        console.log(FILE_NAME, ' removeOldValues method called')
        const db = await getDBConnection();
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(REMOVE_OLD_VALUES), [], (tx, results) => {
                    resolve(results);
                }, (error) => {
                    console.log(FILE_NAME, ' error happened: ', error)
                    reject(results);
                }
            })
        })
    }

}

const databaseAccessor = new DatabaseAccessor();
export default databaseAccessor;