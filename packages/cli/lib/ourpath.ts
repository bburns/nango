import platform from 'node:path';
// import pathPosix from 'node:path/posix';
import slash from 'slash';

export default {
    ...platform,
    //   join: pathPosix.join,
    join: (...paths: string[]) => slash(platform.join(...paths))
    // resolve: (...paths: string[]) => slash(pathPosix.resolve(...paths))
};
