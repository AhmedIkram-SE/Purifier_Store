"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Review } from "@/models/Review"

interface ReviewDisplayProps {
  review: Review
  isUserReview?: boolean
  onEdit?: () => void
}

export default function ReviewDisplay({ review, isUserReview = false, onEdit }: ReviewDisplayProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Badge variant="secondary" className="text-xs">
                {review.rating}.0
              </Badge>
            </div>
            <p className="font-medium text-foreground text-sm">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
          {isUserReview && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>

        <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>

        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <p className="text-xs text-muted-foreground mt-2">Edited on {formatDate(review.updatedAt)}</p>
        )}
      </CardContent>
    </Card>
  )
}
