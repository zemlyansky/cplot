# vim: set noet:
CC = emcc
CXX = em++

FILES =  charter/src/charter_string.c 
FILES += charter/src/clist.c 
FILES += charter/src/parser.c
FILES += charter/src/charter.c
FILES += charter/src/latex.c
FILES += charter/src/svg.c
FILES += charter/src/svg_utils.c
FILES += charter/src/tinyexpr/tinyexpr.c
FILES += charter/src/csv_parser/csvparser.c

EXPORTED_FUNCTIONS="['_charter']"

CFLAGS = -O3 -Wall -fPIC --memory-init-file 0
EMCFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "FS_readFile", "FS_writeFile"]' -s MODULARIZE=1

build:
	${CC} ${CFLAGS} ${EMCFLAGS} ${FILES} src/api.c -o wasm/native.js -s BINARYEN_ASYNC_COMPILATION=0;

