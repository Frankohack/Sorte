import tkinter as tk
from tkinter import messagebox, simpledialog
from PIL import Image, ImageTk
import random
import time
import threading
import pygame
import sys

def iniciar_pygame():
    pygame.init()
    screen = pygame.display.set_mode((800, 600))
    pygame.display.set_caption("Fuegos Artificiales")
    return screen

def mostrar_fuegos_artificiales(screen):
    clock = pygame.time.Clock()
    particles = []

    for _ in range(50):
        x, y = random.randint(100, 700), random.randint(100, 500)
        for _ in range(100):
            dx = random.uniform(-2, 2)
            dy = random.uniform(-2, 2)
            color = random.choice([(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 165, 0)])
            particles.append([x, y, dx, dy, color])

    while particles:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        screen.fill((0, 0, 0))

        for p in particles[:]:
            p[0] += p[2]
            p[1] += p[3]
            p[3] += 0.05  
            pygame.draw.circle(screen, p[4], (int(p[0]), int(p[1])), 3)
            if p[1] > 600: 
                particles.remove(p)

        pygame.display.flip()
        clock.tick(60)

def mostrar_fuegos(ganadores):
    screen = iniciar_pygame()
    mostrar_fuegos_artificiales(screen)
    pygame.quit()

def cargar_seguidores(archivo):
    try:
        with open(archivo, 'r') as f:
            seguidores = [linea.strip() for linea in f]
        return seguidores
    except FileNotFoundError:
        messagebox.showerror("Error", "El archivo de seguidores no se encontró.")
        return []

def seleccionar_ganadores(seguidores, cantidad):
    if len(seguidores) < cantidad:
        messagebox.showerror("Error", "No hay suficientes seguidores para realizar el sorteo.")
        return []
    return random.sample(seguidores, cantidad)

def mostrar_tombola(ganadores):
    for i in range(10): 
        canvas.delete("all")
        canvas.create_oval(100, 100, 300, 300, outline="black", fill="lightblue")
        canvas.create_text(200, 200, text="¡" + random.choice(ganadores) + "!",
                            font=('Arial', 24), fill='black')
        ventana.update()
        time.sleep(0.5)
    
    ganador_final = random.choice(ganadores)
    canvas.delete("all")
    canvas.create_oval(100, 100, 300, 300, outline="black", fill="lightblue")
    canvas.create_text(200, 200, text="¡El Ganador!", font=('Arial', 24, 'bold'), fill='red')
    canvas.create_text(200, 250, text=ganador_final, font=('Arial', 24), fill='black')

    threading.Thread(target=mostrar_fuegos, args=([ganador_final],)).start()

def realizar_sorteo():
    archivo_seguidores = 'C:/Users/fmolina/Desktop/seguidores.txt'
    seguidores = cargar_seguidores(archivo_seguidores)
    
    if not seguidores:
        return
    
    cantidad_premios = simpledialog.askinteger("Número de participantes", 
                                               "¿Cuántos participaran?", minvalue=1)
    if not cantidad_premios:
        return
    
    ganadores = seleccionar_ganadores(seguidores, cantidad_premios)
    
    if ganadores:
        mostrar_tombola(ganadores)

ventana = tk.Tk()
ventana.title("Sorteo de TikTok SensualFM y MR Monty")

ventana.geometry('400x400')

canvas = tk.Canvas(ventana, width=400, height=400, bg='white')
canvas.pack()

try:
    imagen = Image.open("perfil.jpeg")  # Asegúrate de usar la extensión correcta
    imagen = imagen.resize((150, 150), Image.LANCZOS)
    imagen_tk = ImageTk.PhotoImage(imagen)
    etiqueta_imagen = tk.Label(ventana, image=imagen_tk)
    etiqueta_imagen.pack(pady=10)
except FileNotFoundError:
    pass

boton_sorteo = tk.Button(ventana, text="Empezar Sorteo", command=realizar_sorteo, 
                         font=('Arial', 14), bg='#4CAF50', fg='white')

boton_sorteo.pack(pady=20)

ventana.mainloop()