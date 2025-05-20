// Tipos de promociones
export const PROMOTION_TYPES = {
  PLAN: 'plan',
  TEXT: 'text',
  IMAGE: 'image',
  PRICE: 'price'
};

// Modelo de Plan dentro de una promoción
export class Plan {
  constructor({
    name = '',
    description = '',
    listPrice = 0,
    monthlyDiscount = 0,
    finalPrice = 0
  }) {
    this.name = name;
    this.description = description;
    this.listPrice = listPrice;
    this.monthlyDiscount = monthlyDiscount;
    this.finalPrice = finalPrice;
  }
}

// Modelo de Beneficio dentro de una promoción
export class Benefit {
  constructor({
    title = '',
    description = '',
    duration = ''
  }) {
    this.title = title;
    this.description = description;
    this.duration = duration;
  }
}

// Modelo de Promoción
export class Promotion {
  constructor({
    id = null,
    title = '',
    description = '',
    type = PROMOTION_TYPES.PLAN,
    imageUrl = '',
    keywords = [],
    plans = [], // array de Plan
    benefits = [], // array de Benefit
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.imageUrl = imageUrl;
    this.keywords = keywords;
    this.plans = plans;
    this.benefits = benefits;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      title: this.title,
      description: this.description,
      type: this.type,
      imageUrl: this.imageUrl,
      keywords: this.keywords,
      plans: this.plans,
      benefits: this.benefits,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Promotion({
      id: doc.id,
      ...data
    });
  }
}

// Modelo de Nota
export class Note {
  constructor({
    id = null,
    userId = '',
    title = '',
    content = '',
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      userId: this.userId,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Note({
      id: doc.id,
      ...data
    });
  }
}

// Modelo de Presupuesto
export class Budget {
  constructor({
    id = null,
    userId = '',
    items = [],
    total = 0,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      userId: this.userId,
      items: this.items,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Budget({
      id: doc.id,
      ...data
    });
  }
}

// Modelo de Usuario Autorizado
export class AuthorizedUser {
  constructor({
    email = '',
    role = 'user',
    name = '',
    createdAt = new Date()
  }) {
    this.email = email;
    this.role = role;
    this.name = name;
    this.createdAt = createdAt;
  }

  toFirestore() {
    return {
      email: this.email,
      role: this.role,
      name: this.name,
      createdAt: this.createdAt
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new AuthorizedUser({
      email: doc.id,
      ...data
    });
  }
} 