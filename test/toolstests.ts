import hello from '../src/app/core/dataManager';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Data Manager', () => 
{
  it('should return Do something', () => 
  {
    var result = 'Hello World!';

    expect(result).to.equal('Hello World!');
  });
});