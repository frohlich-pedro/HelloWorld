#!/bin/sh
set -e

# Create output directory if it doesn't exist
mkdir -p out

# Assemble the Assembly code
nasm -f elf32 src/HelloWorld.asm -o out/HelloWorld-asm.o

# Compile the C++ source code
g++ -Os -m32 -c src/HelloWorld.cpp -o out/HelloWorld.o

# Link the object files into a binary
ld -m elf_i386 -T linker.ld -o out/HelloWorld.bin out/HelloWorld-asm.o out/HelloWorld.o

# Run the binary in QEMU
qemu-system-i386 -kernel out/HelloWorld.bin
