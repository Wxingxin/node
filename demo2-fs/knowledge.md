好的，我们来系统地学习 Node.js 内置的 fs (File System) 模块的所有核心知识点。我会按照从基础到进阶的顺序讲解。

核心理念：一切皆文件（在类 Unix 系统中）

Node.js 的 fs 模块让你能够以类似于标准 POSIX 函数的方式与文件系统进行交互。它提供了丰富的功能来处理文件和目录。

关键特性：异步与同步

fs 模块中的几乎所有操作都提供**异步（Asynchronous）和同步（Synchronous）**两个版本。

异步 (Asynchronous):

方法名通常不带 Sync 后缀 (例如: fs.readFile()).

非阻塞: 不会阻塞 Node.js 事件循环，适合高并发的服务器环境。

通常接受一个回调函数 (Callback) 作为最后一个参数，回调函数的第一个参数通常是错误对象 (Error | null)。

Node.js v10+ 开始，提供了基于 Promise 的 API (require('fs/promises'))，可以使用 async/await 语法，是现代 Node.js 开发的推荐方式。

同步 (Synchronous):

方法名通常以 Sync 结尾 (例如: fs.readFileSync()).

阻塞: 会阻塞 Node.js 事件循环，直到操作完成。强烈不推荐在服务器或需要高性能的场景中使用，因为它会严重影响并发处理能力。

适用于简单的脚本、命令行工具或程序启动时必须完成的操作。

如果发生错误，会直接抛出异常 (Throw Exception)，需要使用 try...catch 来捕获。

一、 引入模块

// 传统回调风格 / 同步风格
const fs = require('fs');

// Promise 风格 (推荐, Node.js v10+)
const fsPromises = require('fs/promises');
// 或者 const { readFile, writeFile /* ...其他方法 */ } = require('fs/promises');


二、 文件基本操作

读取文件 (Reading Files)

fs.readFile(path[, options], callback) / fsPromises.readFile(path[, options])

fs.readFileSync(path[, options])

path: 文件路径 (字符串, Buffer, 或 URL)。

options (可选):

encoding: 文件编码 (如 'utf8', 'ascii', 'base64')。如果未指定，返回原始的 Buffer 对象。

flag: 文件系统标志 (默认为 'r'，表示读取)。

示例 (Callback):

fs.readFile('myFile.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件出错:', err);
    return;
  }
  console.log('文件内容:', data);
});
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

示例 (Promise):

async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('myFile.txt', 'utf8');
    console.log('文件内容:', data);
  } catch (err) {
    console.error('读取文件出错:', err);
  }
}
readFileAsync();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

示例 (Sync):

try {
  const data = fs.readFileSync('myFile.txt', 'utf8');
  console.log('文件内容:', data);
} catch (err) {
  console.error('读取文件出错:', err);
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

写入文件 (Writing Files)

fs.writeFile(file, data[, options], callback) / fsPromises.writeFile(file, data[, options])

fs.writeFileSync(file, data[, options])

file: 文件路径或文件描述符。

data: 要写入的数据 (字符串, Buffer, TypedArray, DataView)。

options (可选):

encoding: 如果 data 是字符串，指定其编码 (默认 'utf8')。

mode: 文件模式 (权限)，默认为 0o666。

flag: 文件系统标志 (默认为 'w'，表示写入，会覆盖文件)。常用的还有 'a' (追加)。

注意: writeFile 会覆盖已存在的文件内容。如果想追加，请使用 appendFile 或设置 flag: 'a'。

示例 (Promise):

async function writeFileAsync() {
  try {
    await fsPromises.writeFile('newFile.txt', '这是写入的内容。', { flag: 'w' }); // 'w' 是默认值，可省略
    console.log('文件写入成功');
  } catch (err) {
    console.error('写入文件出错:', err);
  }
}
writeFileAsync();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

追加内容到文件 (Appending to Files)

fs.appendFile(path, data[, options], callback) / fsPromises.appendFile(path, data[, options])

fs.appendFileSync(path, data[, options])

参数与 writeFile 类似，但默认 flag 是 'a' (追加)。如果文件不存在，则会创建文件。

示例 (Promise):

async function appendFileAsync() {
  try {
    await fsPromises.appendFile('log.txt', `\n${new Date().toISOString()}: 新日志条目`);
    console.log('内容追加成功');
  } catch (err) {
    console.error('追加内容出错:', err);
  }
}
appendFileAsync();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

检查文件/目录存在性 (Checking Existence)

推荐方式: fs.access() / fsPromises.access()

fs.access(path[, mode], callback) / fsPromises.access(path[, mode])

mode (可选): 检查权限的模式，如 fs.constants.F_OK (仅检查存在性), fs.constants.R_OK (读权限), fs.constants.W_OK (写权限)。默认为 F_OK。

如果文件存在且具有指定权限，回调函数 err 为 null (Promise 会 resolve)。否则，err 会包含错误信息 (Promise 会 reject)。不要用它来在 open 或 readFile 之前检查文件是否存在 (有竞态条件风险)，最好是直接尝试操作并处理可能的错误。

示例 (Promise):

async function checkAccess() {
  try {
    await fsPromises.access('myFile.txt', fs.constants.R_OK | fs.constants.W_OK);
    console.log('文件存在且可读写');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('文件不存在');
    } else if (err.code === 'EACCES') {
      console.error('文件没有所需权限');
    } else {
      console.error('检查访问权限时出错:', err);
    }
  }
}
checkAccess();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

不推荐方式: fs.exists() / fs.existsSync()

fs.exists(path, callback): 回调函数只有一个参数 exists (布尔值)。已废弃 (Deprecated)，因为它的回调不符合 Node.js (error, result) 的标准模式，且存在竞态条件。

fs.existsSync(path): 返回布尔值。同样存在竞态条件。

获取文件/目录信息 (Getting Stats)

fs.stat(path[, options], callback) / fsPromises.stat(path[, options])

fs.lstat(path[, options], callback) / fsPromises.lstat(path[, options]) (获取符号链接本身的信息，而不是它指向的目标)

fs.statSync(path[, options]) / fs.lstatSync(path[, options])

返回一个 fs.Stats 对象，包含文件信息：

stats.isFile(): 是否是文件

stats.isDirectory(): 是否是目录

stats.isSymbolicLink(): 是否是符号链接 (仅 lstat 有意义)

stats.size: 文件大小 (字节)

stats.atime: 最后访问时间 (Access Time)

stats.mtime: 最后修改时间 (Modification Time)

stats.ctime: 最后状态变更时间 (Change Time)

stats.birthtime: 创建时间 (Birth Time)

示例 (Promise):

async function getStats() {
  try {
    const stats = await fsPromises.stat('myFile.txt');
    console.log('是文件吗?', stats.isFile());
    console.log('大小:', stats.size, '字节');
    console.log('最后修改时间:', stats.mtime);
  } catch (err) {
    console.error('获取文件信息出错:', err);
  }
}
getStats();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

重命名/移动文件或目录 (Renaming/Moving)

fs.rename(oldPath, newPath, callback) / fsPromises.rename(oldPath, newPath)

fs.renameSync(oldPath, newPath)

可以在同一文件系统内移动文件或目录。跨文件系统移动可能失败 (需要先复制再删除)。

示例 (Promise):

async function renameFile() {
  try {
    await fsPromises.rename('oldName.txt', 'newName.txt');
    console.log('文件重命名成功');
  } catch (err) {
    console.error('重命名文件出错:', err);
  }
}
renameFile();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

删除文件 (Deleting Files)

fs.unlink(path, callback) / fsPromises.unlink(path)

fs.unlinkSync(path)

用于删除文件。不能删除目录。

示例 (Promise):

async function deleteFile() {
  try {
    await fsPromises.unlink('toBeDeleted.txt');
    console.log('文件删除成功');
  } catch (err) {
    if (err.code === 'ENOENT') {
       console.log('文件本就不存在，无需删除');
    } else {
       console.error('删除文件出错:', err);
    }
  }
}
deleteFile();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

三、 目录操作 (Directory Operations)

创建目录 (Creating Directories)

fs.mkdir(path[, options], callback) / fsPromises.mkdir(path[, options])

fs.mkdirSync(path[, options])

options (可选):

recursive: 布尔值，是否递归创建父目录 (像 mkdir -p)。默认为 false (Node.js v10.12.0+ 支持 recursive: true)。

mode: 目录权限，默认为 0o777。

示例 (Promise, 递归创建):

async function createDirectory() {
  try {
    await fsPromises.mkdir('path/to/nested/directory', { recursive: true });
    console.log('目录创建成功');
  } catch (err) {
    console.error('创建目录出错:', err);
  }
}
createDirectory();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

读取目录内容 (Reading Directories)

fs.readdir(path[, options], callback) / fsPromises.readdir(path[, options])

fs.readdirSync(path[, options])

返回一个包含目录下所有文件名（字符串）或 fs.Dirent 对象（如果 options.withFileTypes 为 true）的数组。不包括 . 和 ..。

options.withFileTypes (布尔值): 如果为 true，返回 fs.Dirent 对象数组，每个对象包含 name 属性和判断类型的 isFile(), isDirectory() 等方法，比再次调用 fs.stat 更高效。

示例 (Promise, 获取 Dirent):

async function readDirectory() {
  try {
    const dirents = await fsPromises.readdir('.', { withFileTypes: true });
    for (const dirent of dirents) {
      const type = dirent.isDirectory() ? '目录' : '文件';
      console.log(`${dirent.name} (${type})`);
    }
  } catch (err) {
    console.error('读取目录出错:', err);
  }
}
readDirectory();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

删除目录 (Removing Directories)

fs.rmdir(path[, options], callback) / fsPromises.rmdir(path[, options]) (老 API)

fs.rmdirSync(path[, options]) (老 API)

只能删除空目录。尝试删除非空目录会报错 (ENOTEMPTY)。

options.recursive (已废弃，不建议使用)。

fs.rm(path[, options], callback) / fsPromises.rm(path[, options]) (推荐, Node.js v14.14.0+)

fs.rmSync(path[, options]) (推荐)

功能更强大的删除 API，可以删除文件和目录。

options.recursive (布尔值): 如果为 true，可以递归删除目录及其内容（危险操作，请谨慎使用！）。

options.force (布尔值): 如果为 true，忽略不存在的路径错误。

示例 (Promise, 使用 rm 删除非空目录):

async function removeDirectoryRecursive() {
  try {
    // 警告：这将永久删除目录及其所有内容！
    await fsPromises.rm('directoryToRemove', { recursive: true, force: true });
    console.log('目录及其内容已删除');
  } catch (err) {
    console.error('删除目录时出错:', err);
  }
}
// removeDirectoryRecursive(); // 确保你知道你在做什么！
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

四、 文件流 (File Streams)

处理大文件时，一次性读入内存可能会导致内存溢出。流 (Streams) 允许你以小块 (chunks) 的形式处理数据。

创建可读流 (Readable Stream)

fs.createReadStream(path[, options])

返回一个 fs.ReadStream 对象。

options: 可以设置 encoding, flags, mode, start, end, highWaterMark (缓冲区大小) 等。

示例 (配合管道 pipe):

const readStream = fs.createReadStream('largeFile.log', 'utf8');
const writeStream = fs.createWriteStream('copyOfLargeFile.log');

readStream.on('error', (err) => console.error('读取流错误:', err));
writeStream.on('error', (err) => console.error('写入流错误:', err));
writeStream.on('finish', () => console.log('文件复制完成')); // 'finish' 事件表示写入完成

// 使用 pipe() 高效地将数据从可读流传输到可写流
readStream.pipe(writeStream);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

示例 (手动处理数据块):

const readStream = fs.createReadStream('data.csv', { highWaterMark: 64 * 1024 }); // 64KB 缓冲区

let totalBytes = 0;
readStream.on('data', (chunk) => {
  console.log(`收到 ${chunk.length} 字节的数据`);
  totalBytes += chunk.length;
  // 在这里处理数据块 (chunk)
});

readStream.on('end', () => {
  console.log('文件读取完毕，总共读取:', totalBytes, '字节');
});

readStream.on('error', (err) => {
  console.error('读取文件流时出错:', err);
});
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

创建可写流 (Writable Stream)

fs.createWriteStream(path[, options])

返回一个 fs.WriteStream 对象。

options: 可以设置 encoding, flags (默认为 'w'), mode, start 等。

可以通过 .write(chunk) 方法写入数据，并通过监听 drain 事件来处理背压 (backpressure)。.end() 方法用于结束写入。

示例: (见上面 createReadStream 的 pipe 示例)

五、 文件监听 (Watching Files/Directories)

用于监控文件或目录的变化。

fs.watch(filename[, options][, listener])

更高效、功能更强，但跨平台行为可能不一致，且 API 较复杂。

返回一个 fs.FSWatcher 对象，它是一个 EventEmitter。

监听 change 事件 (eventType, filename) 和 error 事件。

eventType 可能是 'rename' 或 'change'。filename 可能不总是提供（特别是在 macOS 上监听目录时）。

options.recursive: 是否递归监听子目录 (在支持的平台上)。

options.persistent: 如果为 true (默认)，只要 watcher 在运行，Node.js 进程就不会退出。

示例:

try {
  const watcher = fs.watch('watchedFolder', { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`事件类型: ${eventType}, 文件名: ${filename}`);
    } else {
      console.log(`事件类型: ${eventType}, 触发于被监听目录本身`);
    }
  });

  watcher.on('error', (error) => console.error('Watcher 错误:', error));

  console.log('开始监听 watchedFolder...');

  // watcher.close(); // 不再需要时关闭监听器

} catch (err) {
  console.error('启动监听器失败:', err);
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

fs.watchFile(filename[, options], listener)

通过轮询 (polling) 文件状态 (fs.stat) 来检测变化。

性能开销比 fs.watch 大，但在某些 fs.watch 不可靠的环境或网络文件系统上可能更稳定。

监听器 listener(curr, prev) 接收当前 (fs.Stats) 和先前 (fs.Stats) 的状态对象。

options.interval: 轮询间隔（毫秒），默认 5007。

options.persistent: 同 fs.watch。

示例:

fs.watchFile('watchedFile.txt', { interval: 1000 }, (curr, prev) => {
  console.log(`文件当前修改时间: ${curr.mtime}`);
  console.log(`文件先前修改时间: ${prev.mtime}`);
  if (curr.mtime !== prev.mtime) {
     console.log('文件内容已更改！');
  }
});
console.log('开始轮询监听 watchedFile.txt...');
// fs.unwatchFile('watchedFile.txt'); // 停止监听
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

六、 文件描述符 (File Descriptors)

文件描述符是操作系统内核用来标识已打开文件的非负整数。fs 模块允许你进行更底层的操作。

打开文件 (fs.open / fsPromises.open): 获取文件描述符。

fs.open(path[, flags[, mode]], callback) / fsPromises.open(path[, flags[, mode]])

flags: 打开文件的模式，如 'r', 'w', 'a', 'r+' (读写)。

mode: 文件权限 (仅在创建文件时有效)。

回调函数/Promise 返回文件描述符 fd。

必须手动关闭文件描述符！

使用文件描述符读写 (fs.read, fs.write): 在文件的特定位置进行读写。

fs.read(fd, buffer, offset, length, position, callback) / fsPromises.read(fd, buffer, offset, length, position)

fs.write(fd, buffer[, offset[, length[, position]]], callback) / fsPromises.write(fd, buffer[, offset[, length[, position]]])

这些函数提供了更精细的控制，但使用起来更复杂。

关闭文件 (fs.close / fsPromises.close): 释放文件描述符。

fs.close(fd, callback) / fsPromises.close(fd)

极其重要: 每次 open 之后，无论成功还是失败，都必须调用 close 来防止资源泄漏。通常在 finally 块中执行。

示例 (Promise, 打开、写入、读取、关闭):

async function operateWithFd() {
  let fd; // 文件描述符变量
  try {
    // 1. 打开文件获取描述符 (写入模式，如果不存在则创建)
    fd = await fsPromises.open('dataWithFd.txt', 'w+'); // w+ 表示读写，文件不存在则创建

    // 2. 写入数据
    const bufferToWrite = Buffer.from('使用文件描述符写入\n');
    const { bytesWritten } = await fsPromises.write(fd, bufferToWrite, 0, bufferToWrite.length, 0); // 从位置 0 开始写
    console.log(`写入了 ${bytesWritten} 字节`);

    // 3. 读取数据 (需要一个 Buffer 来接收)
    const bufferToRead = Buffer.alloc(1024);
    const { bytesRead, buffer: readBuffer } = await fsPromises.read(fd, bufferToRead, 0, bufferToRead.length, 0); // 从位置 0 开始读
    console.log(`读取了 ${bytesRead} 字节:`, readBuffer.toString('utf8', 0, bytesRead));

  } catch (err) {
    console.error('文件描述符操作出错:', err);
  } finally {
    // 4. 无论成功或失败，都尝试关闭文件描述符
    if (fd !== undefined) {
      try {
        await fsPromises.close(fd);
        console.log('文件描述符已关闭');
      } catch (closeErr) {
        console.error('关闭文件描述符时出错:', closeErr);
      }
    }
  }
}
operateWithFd();
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

七、 其他重要函数

fs.copyFile(src, dest[, mode], callback) / fsPromises.copyFile(src, dest[, mode]): 复制文件。

mode (可选): fs.constants.COPYFILE_EXCL (如果目标已存在则失败), fs.constants.COPYFILE_FICLONE (尝试创建写时复制 reflink)。

fs.truncate(path[, len], callback) / fsPromises.truncate(path[, len]): 截断文件到指定长度 len (默认为 0)。

fs.chmod(path, mode, callback) / fsPromises.chmod(path, mode): 修改文件权限 (mode 是八进制数，如 0o755)。

fs.chown(path, uid, gid, callback) / fsPromises.chown(path, uid, gid): 修改文件所有者和所属组。

fs.link(existingPath, newPath, callback) / fsPromises.link(existingPath, newPath): 创建硬链接。

fs.symlink(target, path[, type], callback) / fsPromises.symlink(target, path[, type]): 创建符号链接 (软链接)。

type (Windows): 'file', 'dir', 'junction'。

八、 fs.constants

一个包含常用文件系统常量的对象，例如：

文件访问权限: F_OK, R_OK, W_OK, X_OK

文件打开标志: O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_TRUNC, O_APPEND, O_EXCL

文件类型 (用于 stat): S_IFMT, S_IFREG, S_IFDIR, S_IFLNK 等。

复制文件模式: COPYFILE_EXCL, COPYFILE_FICLONE

九、 最佳实践与注意事项

优先使用 fs.promises: 利用 async/await 可以写出更简洁、更易于维护的异步代码。

错误处理: 始终检查回调函数的 err 参数或使用 try...catch 捕获 Promise 的 rejection。处理常见的错误码，如 ENOENT (文件/目录不存在), EACCES (权限不足), EEXIST (文件已存在), ENOTEMPTY (目录非空)。

避免同步方法: 在服务器或任何需要响应性的应用中，坚决避免使用同步 API (*Sync)，它们会阻塞事件循环。

路径处理: 使用 Node.js 内置的 path 模块 (require('path')) 来处理文件路径，确保跨平台兼容性 (path.join(), path.resolve(), path.dirname(), path.basename() 等)。不要手动拼接路径字符串或硬编码路径分隔符 (/ 或 \)。

资源管理: 如果使用了 fs.open 获取文件描述符，必须确保调用 fs.close。使用流通常是处理大文件和管理底层资源的更好方式。

安全性: 当处理用户提供的路径时，要极其小心路径遍历 (Path Traversal) 攻击 (../../...)。务必对用户输入进行严格的验证和清理，并考虑将文件操作限制在安全的根目录下。

流的背压处理: 在使用流手动写入数据时 (writeStream.write())，要注意检查返回值。如果返回 false，表示缓冲区已满，应暂停写入，并在 drain 事件触发后再继续，以防止内存暴涨。使用 .pipe() 会自动处理背压。

掌握这些知识点，你就能有效地使用 Node.js 的 fs 模块来完成各种文件系统相关的任务了。建议多动手实践这些 API，加深理解。