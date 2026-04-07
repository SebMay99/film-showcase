export type Lang = "es" | "en";

export type Translations = {
  nav: {
    all: string;
    about: string;
    contact: string;
  };
  gallery: {
    frames: string;
    admin: string;
    upload: string;
    uploading: string;
    newPhoto: string;
    cameraType: string;
    uploadingAs: string;
    title: string;
    description: string;
    optional: string;
    date: string;
    camera: string;
    filmRoll: string;
    iso: string;
    filmType: string;
    color: string;
    bw: string;
    selectPhotos: string;
    cancel: string;
    adminKey: string;
    enter: string;
    editPhoto: string;
    category: string;
    save: string;
    blankRoll: string;
    noPhotos: string;
    close: string;
    deleteConfirm: string;
  };
  categories: {
    todos: string;
    viaje: string;
    retrato: string;
    urbano: string;
    naturaleza: string;
    otro: string;
  };
  about: {
    section: string;
    bio: string;
    equipment: string;
    categories: string;
    social: string;
    bioText: string;
    equipmentText: string;
    photoHere: string;
    tags: string[];
  };
  contact: {
    section: string;
    heading: string;
    name: string;
    namePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    sending: string;
    send: string;
    error: string;
    sent: string;
    soon: string;
    another: string;
    alsoOn: string;
  };
};

const translations: Record<Lang, Translations> = {
  es: {
    nav: {
      all: "Todas",
      about: "About",
      contact: "Contacto",
    },
    gallery: {
      frames: "frames",
      admin: "ADMIN",
      upload: "Subir fotos",
      uploading: "Subiendo...",
      newPhoto: "Nueva foto",
      cameraType: "Tipo de cámara",
      uploadingAs: "Subiendo como",
      title: "Título",
      description: "Descripción",
      optional: "Opcional",
      date: "Fecha",
      camera: "Cámara",
      filmRoll: "Marca del rollo",
      iso: "ISO",
      filmType: "Tipo de rollo",
      color: "Color",
      bw: "B&W",
      selectPhotos: "Seleccionar fotos",
      cancel: "Cancelar",
      adminKey: "Clave de administrador",
      enter: "Entrar",
      editPhoto: "Editar foto",
      category: "Categoría",
      save: "Guardar",
      blankRoll: "El carrete está en blanco",
      noPhotos: "Sin fotos en esta categoría",
      close: "cerrar",
      deleteConfirm: "¿Eliminar esta foto?",
    },
    categories: {
      todos: "todos",
      viaje: "viaje",
      retrato: "retrato",
      urbano: "urbano",
      naturaleza: "naturaleza",
      otro: "otro",
    },
    about: {
      section: "About — 01",
      bio: "Bio",
      equipment: "Equipo",
      categories: "Categorías",
      social: "Redes",
      bioText: "Fotógrafo aficionado con ojo para los momentos cotidianos y la luz natural. Capturo todo tipo de escenas: viajes, retratos, arquitectura urbana y naturaleza.",
      equipmentText: "Edita este texto con tu equipo real — cámara, lentes, película favorita.",
      photoHere: "Foto aquí",
      tags: ["Viaje", "Retrato", "Urbano", "Naturaleza"],
    },
    contact: {
      section: "Contacto — 03",
      heading: "Escríbeme",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      message: "Mensaje",
      messagePlaceholder: "¿En qué te puedo ayudar?",
      sending: "Enviando...",
      send: "Enviar mensaje →",
      error: "Hubo un error. Intenta de nuevo.",
      sent: "Mensaje enviado",
      soon: "Te respondo pronto.",
      another: "Enviar otro mensaje",
      alsoOn: "También en",
    },
  },
  en: {
    nav: {
      all: "All",
      about: "About",
      contact: "Contact",
    },
    gallery: {
      frames: "frames",
      admin: "ADMIN",
      upload: "Upload photos",
      uploading: "Uploading...",
      newPhoto: "New photo",
      cameraType: "Camera type",
      uploadingAs: "Uploading as",
      title: "Title",
      description: "Description",
      optional: "Optional",
      date: "Date",
      camera: "Camera",
      filmRoll: "Film roll",
      iso: "ISO",
      filmType: "Film type",
      color: "Color",
      bw: "B&W",
      selectPhotos: "Select photos",
      cancel: "Cancel",
      adminKey: "Admin key",
      enter: "Enter",
      editPhoto: "Edit photo",
      category: "Category",
      save: "Save",
      blankRoll: "The roll is blank",
      noPhotos: "No photos in this category",
      close: "close",
      deleteConfirm: "Delete this photo?",
    },
    categories: {
      todos: "all",
      viaje: "travel",
      retrato: "portrait",
      urbano: "urban",
      naturaleza: "nature",
      otro: "other",
    },
    about: {
      section: "About — 01",
      bio: "Bio",
      equipment: "Equipment",
      categories: "Categories",
      social: "Social",
      bioText: "Amateur photographer with an eye for everyday moments and natural light. I capture all kinds of scenes: travel, portraits, urban architecture, and nature.",
      equipmentText: "Edit this text with your real gear — camera, lenses, favourite film.",
      photoHere: "Photo here",
      tags: ["Travel", "Portrait", "Urban", "Nature"],
    },
    contact: {
      section: "Contact — 03",
      heading: "Write to me",
      name: "Name",
      namePlaceholder: "Your name",
      message: "Message",
      messagePlaceholder: "How can I help you?",
      sending: "Sending...",
      send: "Send message →",
      error: "Something went wrong. Try again.",
      sent: "Message sent",
      soon: "I'll get back to you soon.",
      another: "Send another message",
      alsoOn: "Also on",
    },
  },
};

export default translations;
