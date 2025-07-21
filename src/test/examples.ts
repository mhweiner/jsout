import {logger} from '..';

class CustomError extends Error {

    foo: string;

    constructor(message: string) {

        super(message);

        this.foo = 'bar';

    }

}

logger.error(undefined, new CustomError('test error'));
logger.error(undefined, new Error('blah'), {foo: 'bar'});
