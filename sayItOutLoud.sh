set -e
nasm -f elf32 src/HelloWorld.asm -o out/HelloWorld-asm.o
g++ -Os -m32 -c src/HelloWorld.cpp -o out/HelloWorld.o
ld -m elf_i386 -T linker.ld -o out/HelloWorld.bin HelloWorld-asm.o HelloWorld.o
qemu-system-i386 -kernel HelloWorld.bin
