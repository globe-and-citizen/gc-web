import mitt from 'mitt';

const emitter = mitt();

export const { emit, on } = emitter; // Export these functions if used in your component

export default emitter;
