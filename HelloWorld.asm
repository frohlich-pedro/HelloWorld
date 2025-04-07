bits 32
section .text
	align 4
	dd 0x1BADB002			;magic
	dd 0x00				;flags
	dd - (0x1BADB002 + 0x00)	;checksum. m+f+c should be zero

global start
extern kernelMain	;k_main is defined in the kernel.c file

start:
	cli  ; stop interrupts
	call kernelMain
	hlt ; halt the CPU
