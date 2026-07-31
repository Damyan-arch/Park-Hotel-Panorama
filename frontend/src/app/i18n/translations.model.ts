export type Locale = 'en' | 'bg' | 'de' | 'es' | 'ro';

export interface LocaleOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'bg', label: 'Bulgarian', nativeLabel: 'Български', flag: '🇧🇬' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'ro', label: 'Romanian', nativeLabel: 'Română', flag: '🇷🇴' },
];

export const DEFAULT_LOCALE: Locale = 'en';

interface RoomCopy {
  name: string;
}

interface AmenityCopy {
  tv: string;
  wifi: string;
  ac: string;
  mountainView: string;
}

interface HighlightCopy {
  title: string;
  description: string;
}

interface ThingToDoCopy {
  title: string;
  description: string;
}

interface DirectionCopy {
  heading: string;
  text: string;
}

interface GalleryAltCopy {
  loungeLobby: string;
  restaurantHall: string;
  twinRoom: string;
  roomLounge: string;
  courtyardGarden: string;
  roseGarden: string;
}

export interface Translations {
  nav: {
    rooms: string;
    restaurant: string;
    gallery: string;
    services: string;
    location: string;
    bookNow: string;
    toggleNav: string;
    changeLanguage: string;
  };

  footer: {
    tagline: string;
    exploreHeading: string;
    contactHeading: string;
    address: string;
    rightsReserved: string;
  };

  home: {
    heroTitle: string;
    heroSubtitle: string;
    bookNow: string;
    aboutHeading: string;
    aboutText: string;
    highlights: {
      rooms: HighlightCopy;
      restaurant: HighlightCopy;
      poolSpa: HighlightCopy;
      location: HighlightCopy;
    };
    thingsToDoHeading: string;
    thingsToDoIntro: string;
    thingsToDo: {
      poolSpa: ThingToDoCopy;
      culturalSites: ThingToDoCopy;
      bikeTrails: ThingToDoCopy;
      localCuisine: ThingToDoCopy;
      wineries: ThingToDoCopy;
    };
  };

  rooms: {
    heroTitle: string;
    heroSubtitle: string;
    maxLabel: string;
    bookNow: string;
    photoComingSoon: string;
    amenities: AmenityCopy;
    items: {
      doubleRoom: RoomCopy;
      apartment: RoomCopy;
      tripleRoom: RoomCopy;
      townSuite: RoomCopy;
    };
  };

  restaurant: {
    heroTitle: string;
    heroSubtitle: string;
    diningHallAlt: string;
    workingHoursHeading: string;
    hoursDays: string;
    hoursTime: string;
    menuHeading: string;
    menuComingSoon: string;
    signatureDishAlt: string;
  };

  gallery: {
    heroTitle: string;
    heroSubtitle: string;
    close: string;
    alt: GalleryAltCopy;
  };

  services: {
    heroTitle: string;
    heroSubtitle: string;
    comingSoon: string;
  };

  location: {
    heroTitle: string;
    heroSubtitle: string;
    ourLocationHeading: string;
    ourLocationText: string;
    mapTitle: string;
    howToGetThereHeading: string;
    directions: {
      airport: DirectionCopy;
      trainStation: DirectionCopy;
      byCar: DirectionCopy;
    };
  };

  contact: {
    heroTitle: string;
    heroSubtitle: string;
    phoneLabel: string;
  };

  booking: {
    heroTitle: string;
    heroSubtitle: string;
    thankYouHeading: string;
    thankYouText: string;
    urgentCallText: string;
    errors: {
      roomUnavailable: string;
      generic: string;
      checkIn: string;
      checkOut: string;
      room: string;
      name: string;
      email: string;
      phone: string;
    };
    labels: {
      room: string;
      roomPlaceholder: string;
      fullName: string;
      email: string;
      phone: string;
    };
    submitButton: string;
    modal: {
      heading: string;
      intro: string;
      checkIn: string;
      checkOut: string;
      room: string;
      name: string;
      email: string;
      phone: string;
      edit: string;
      confirm: string;
    };
    sendingRequest: string;
  };

  datePicker: {
    checkIn: string;
    checkOut: string;
    selectDate: string;
    prevMonth: string;
    nextMonth: string;
    months: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    weekdays: [string, string, string, string, string, string, string];
    legend: {
      available: string;
      unavailable: string;
      inRange: string;
      selected: string;
    };
  };

  select: {
    defaultPlaceholder: string;
  };
}
