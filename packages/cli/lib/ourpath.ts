import platform from 'node:path';
// import posix from 'node:path/posix';
// import slash from 'slash';

export default {
    ...platform
    //   join: posix.join,
    // join: (...paths: string[]) => slash(platform.join(...paths))
    // resolve: (...paths: string[]) => slash(posix.resolve(...paths))
};
