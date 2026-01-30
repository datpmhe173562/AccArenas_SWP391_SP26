import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import './StarRating.css';

export default function StarRating({
    rating = 0,
    onChange,
    readonly = false,
    size = 'md'
}) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onChange) {
            onChange(value);
        }
    };

    const sizeClass = `star-rating-${size}`;

    return (
        <div className={`star-rating ${sizeClass} ${readonly ? 'star-rating-readonly' : ''}`}>
            {[1, 2, 3, 4, 5].map((value) => {
                const isFilled = value <= (hoverRating || rating);

                return (
                    <button
                        key={value}
                        type="button"
                        className="star-button"
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => !readonly && setHoverRating(value)}
                        onMouseLeave={() => !readonly && setHoverRating(0)}
                        disabled={readonly}
                    >
                        {isFilled ? (
                            <StarIcon className="star-icon star-filled" />
                        ) : (
                            <StarOutlineIcon className="star-icon star-empty" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
