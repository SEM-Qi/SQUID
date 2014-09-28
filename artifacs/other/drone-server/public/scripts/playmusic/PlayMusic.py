import pygame
import sys
import os

def init():
  pygame.mixer.init()
  
def PlayMusic (songName):
  pygame.mixer.music.load (songName)
  pygame.mixer.music.play()
  while pygame.mixer.music.get_busy():
    continue
    
if __name__ =='__main__':
  fullPath = os.path.dirname(os.path.realpath(__file__))
  init()
  songName = sys.argv[1:]
  strSong = fullPath +'/'+ songName[0]
  PlayMusic (strSong)
  
