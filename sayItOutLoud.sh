#!/bin/sh
set -e
mkdir -p out
nasm -f elf32 src/HelloWorld.asm -o out/HelloWorld-asm.o
g++ -Os -m32 -c src/HelloWorld.cpp -o out/HelloWorld.o
ld -m elf_i386 -T linker.ld -o out/HelloWorld.bin out/HelloWorld-asm.o out/HelloWorld.o
qemu-system-i386 -kernel out/HelloWorld.bin
