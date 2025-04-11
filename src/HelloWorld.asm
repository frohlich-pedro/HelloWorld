bits 32

section .multiboot
    align 4
    dd 0x1BADB002
    dd 0x00
    dd -(0x1BADB002 + 0x00)

section .text
    global start
    extern kernelMain

start:
    cli
    call boot_clear_screen
    mov esi, boot_msg
    mov edi, 0xb8000
    call boot_print_string
    call kernelMain
    hlt

boot_clear_screen:
    mov edi, 0xb8000
    mov ecx, 80*25
    mov ax, 0x0720
    rep stosw
    ret

boot_print_string:
.print_char:
    lodsb
    test al, al
    jz .done
    cmp al, 10
    je .newline
    mov byte [edi], al
    mov byte [edi+1], 0x0F
    add edi, 2
    jmp .print_char

.newline:
    mov ebx, edi
    sub ebx, 0xb8000
    mov eax, ebx
    xor edx, edx
    mov ecx, 160
    div ecx
    inc eax
    imul eax, eax, 160
    add eax, 0xb8000
    mov edi, eax
    jmp .print_char

.done:
    ret

section .data
    boot_msg db "Bootloader: calling kernel...", 10, 0
