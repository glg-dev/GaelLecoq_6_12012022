'use strict'
// Code JavaScript lié à la page photographer.html

import PhotographerGallery from '../models/photographerGallery.js'
import { likeIncrement, totalLikes } from '../functions/likesCounters.js'
import Presentation from '../templates/photographerPresentation.js'
import { sortBy } from '../functions/sortBy.js'
import { lightbox } from '../utils/lightbox.js'
import { escapeButton } from '../functions/escapeButton.js'
import { MediaFactory } from '../factories/MediaFactory.js'

export const gallerySection = document.querySelector('.gallery-section') // Galerie où s'affichent les images
const presentationBloc = document.getElementById('presentation-bloc') // Bloc de présentation du photographe
const photographerImg = document.getElementById('photographer-img') // Div d'affichage de l'image de présentation du photographe
const priceContainer = document.querySelector('.price') // Affichage du prix journalier
const photographerName = document.getElementById('photographer__name') // Affichage du nom du photographe dans la modale de contact

let pageID = 0
let photographers = []
let media = []
export const gallery = []

// Récupération de l'ID de la page
const getPageId = () => {
  pageID = parseInt(new URLSearchParams(window.location.search).get('id'))
}
getPageId()

export const fetchDatas = async () => {
  await fetch('data/photographers.json')
    .then((result) => result.json())
    .then((result) => {
      // result.data
      photographers = result.photographers
      photographersInfoDisplay()
      media = result.media
      mediaDisplay()
      lightbox()
      sortBy(gallery)
      totalLikes()
      likeIncrement()
      escapeButton()
    })
    .catch((err) => console.error('Erreur :', err))
}

const photographersInfoDisplay = () => {
  photographers.forEach((photographer) => {
    // Si l'ID du photographe correspond à celui de la page html
    if (photographer.id === pageID) {
      // Affichage du prix du photographe dans la <span> dédiée
      priceContainer.textContent = photographer.price
      photographerName.textContent = photographer.name
      // Écriture de la bannière
      const presentation = new Presentation(photographer)
      presentationBloc.innerHTML = presentation.getPresentation()
      photographerImg.innerHTML = presentation.getPhotographerImg()
    }
  })
}

const mediaDisplay = () => {
  media.forEach((item) => {
    if (item.photographerId === pageID) {
      gallery.push(item)
    }
  })
  createGallery(gallery)
}

export function createGallery (array) {
  gallerySection.innerHTML = ''
  array.forEach((element) => {
    const photographerGallery = new PhotographerGallery(element)
    const PhotographerMediaTemplate = new MediaFactory(photographerGallery)
    gallerySection.innerHTML += PhotographerMediaTemplate.getMedia()
  })
}

fetchDatas()
