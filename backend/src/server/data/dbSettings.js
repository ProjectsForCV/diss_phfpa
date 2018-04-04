module.exports = {
    host     : 'localhost',
    user     : 'root',
    password : 'fib5589',
    database : 'pdb',
    typeCast: (field, useDefaultTypeCasting) => {

        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            let bytes = field.buffer();

            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );
    }
};