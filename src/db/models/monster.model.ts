import mongoose from 'mongoose'

const { Schema } = mongoose

const monsterSchema = new Schema({
  name: {
    type: String, // = 'string'
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  draw: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy']
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
})

export default mongoose.model('Monster', monsterSchema) ?? mongoose.models.Monster
