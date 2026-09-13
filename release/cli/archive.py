"""Deterministic current-resource archive; extraction accepts regular files only."""
import gzip
import pathlib
import re
import sys
import tarfile


def unpack(archive, destination):
    destination.mkdir()  # Never reuse an existing extraction directory.
    seen = set()
    total = 0
    with tarfile.open(archive, 'r:*') as source:
        for member in source:
            parts = member.name.split('/')
            if (not member.isfile() or member.name in seen
                    or any(part in ('.', '..') or not re.fullmatch(r'[A-Za-z0-9_.-]+', part) for part in parts)):
                raise ValueError('RELEASE_ARCHIVE_MEMBER_INVALID')
            seen.add(member.name)
            total += member.size
            if len(seen) > 10000 or total > 256 * 1024 * 1024:
                raise ValueError('RELEASE_ARCHIVE_LIMIT')
            output = destination.joinpath(*parts)
            output.parent.mkdir(parents=True, exist_ok=True)
            with source.extractfile(member) as reader, output.open('xb') as writer:
                while data := reader.read(1024 * 1024):
                    writer.write(data)


def pack(source, archive):
    with archive.open('xb') as output, gzip.GzipFile(filename='', mode='wb', fileobj=output, mtime=0) as compressed:
        with tarfile.open(fileobj=compressed, mode='w', format=tarfile.USTAR_FORMAT) as target:
            for item in sorted(source.rglob('*')):
                if item.is_symlink():
                    raise ValueError('RELEASE_ARCHIVE_SYMLINK')
                if item.is_dir():
                    continue
                if not item.is_file():
                    raise ValueError('RELEASE_ARCHIVE_MEMBER_INVALID')
                info = tarfile.TarInfo(item.relative_to(source).as_posix())
                info.size = item.stat().st_size
                info.mode = 0o644
                with item.open('rb') as reader:
                    target.addfile(info, reader)


if __name__ == '__main__':
    action, first, second = sys.argv[1:]
    if action == 'pack':
        pack(pathlib.Path(first), pathlib.Path(second))
    elif action == 'unpack':
        unpack(pathlib.Path(first), pathlib.Path(second))
    else:
        raise ValueError('RELEASE_ARCHIVE_USAGE')
