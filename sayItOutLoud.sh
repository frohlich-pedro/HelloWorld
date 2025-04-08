set -e
nasm -f elf32 HelloWorld.asm -o HelloWorld-asm.o
g++ -Os -m32 -c HelloWorld.cpp -o HelloWorld.o
ld -m elf_i386 -T linker.ld -o HelloWorld.bin HelloWorld-asm.o HelloWorld.o
qemu-system-i386 -kernel HelloWorld.bin
