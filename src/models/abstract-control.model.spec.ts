import { AbstractControl } from './abstract-control.model';

describe('Abstract Control Class', () => {
  let ac: AbstractControl;

  beforeEach(() => {
    ac = new AbstractControl();
  });

  it('AbstractControl is instantiable', () => {
    expect(new AbstractControl()).toBeInstanceOf(AbstractControl);
  });

  it('inital state', () => {
    expect(ac.$dirty).toBeFalsy();
    expect(ac.$touch).toBeFalsy();
    expect(ac.$focus).toBeFalsy();
    expect(ac.$loading).toBeFalsy();
    expect(ac.$errors).toBeInstanceOf(Object);
    expect(ac.value).toBeUndefined();
    expect(ac.validators.length).toBe(0);
    expect(ac.asyncValidators.length).toBe(0);
    expect(ac.$name).toBe('root');
  });

  it('should reduce an array of booleans using and operator', () => {
    expect(ac.reduceBooleanArray()).toBeTruthy();
    expect(ac.reduceBooleanArray([false])).toBeFalsy();
    expect(ac.reduceBooleanArray([true, true])).toBeTruthy();
    expect(ac.reduceBooleanArray([false, true])).toBeFalsy();
    expect(ac.reduceBooleanArray([true, true, false])).toBeFalsy();
  });

  it('should throw not implemented', () => {
    expect(() => ac.onChange(ac)).toThrow('not implemented');
  });

  it('should notify parent');

  it('should add error', () => {
    ac.addError('error', 'some message');
    expect(ac.$errors['error']).toBe('some message');
  });

  it('should remove error', () => {
    ac.addError('error', 'some message');
    expect(ac.$errors['error']).toBe('some message');
    ac.removeError('error');
    expect(ac.$errors['error']).toBeUndefined();
  });

  it('should validate Sync', () => {
    const mockValidator = jest.fn();

    mockValidator.mockReturnValueOnce(false).mockReturnValueOnce(true);

    expect(ac.validateSync()).toBeTruthy();

    ac.validators.push(mockValidator);

    expect(ac.validateSync()).toBeFalsy();
    expect(ac.validateSync()).toBeTruthy();
  });
});
