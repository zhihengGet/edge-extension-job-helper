import { proxy } from 'valtio';

const state = proxy({ jobs: 0, text: "hello" });

export { state };

// not used ...
