"use client"

interface Word {
  text: string
  value: number
  sentiment: string
}

interface WordCloudProps {
  words: Word[]
}

export default function WordCloud({ words }: WordCloudProps) {
  const maxValue = Math.max(...words.map((w) => w.value))

  const getWordSize = (value: number) => {
    const minSize = 14
    const maxSize = 36
    const normalizedValue = value / maxValue
    return minSize + (maxSize - minSize) * normalizedValue
  }

  const getWordColor = (sentiment: string, value: number) => {
    const normalizedValue = value / maxValue
    const opacity = 0.6 + normalizedValue * 0.4 // 0.6 to 1.0 opacity

    switch (sentiment) {
      case "positive":
        return `rgba(16, 185, 129, ${opacity})` // emerald
      case "negative":
        return `rgba(239, 68, 68, ${opacity})` // red
      default:
        return `rgba(107, 114, 128, ${opacity})` // gray
    }
  }

  const getSentimentHoverColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "hover:text-emerald-600"
      case "negative":
        return "hover:text-red-600"
      default:
        return "hover:text-gray-600"
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-6 min-h-[300px] bg-gradient-to-br from-gray-50 to-white rounded-lg">
      {words.map((word, index) => (
        <span
          key={index}
          className={`font-bold transition-all duration-300 hover:scale-110 cursor-pointer select-none ${getSentimentHoverColor(word.sentiment)}`}
          style={{
            fontSize: `${getWordSize(word.value)}px`,
            color: getWordColor(word.sentiment, word.value),
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          title={`"${word.text}" - Mentioned ${word.value} times (${word.sentiment} sentiment)`}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}
