import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface QuantitySuggestionPopupProps {
  product: any;
  onAddQuantity: (quantity: number) => void;
  disabled?: boolean;
}

export const QuantitySuggestionPopup: React.FC<QuantitySuggestionPopupProps> = ({
  product,
  onAddQuantity,
  disabled = false
}) => {
  // Generate suggested quantities based on product stock and common use patterns
  const getSuggestedQuantities = () => {
    const suggestions = [1, 2, 5];
    
    // Add more suggestions based on stock levels
    if (product.stock > 10) {
      suggestions.push(10);
    }
    if (product.stock > 25) {
      suggestions.push(25);
    }
    if (product.stock > 50) {
      suggestions.push(50);
    }
    
    // Filter out quantities that exceed stock (unless incomplete quantity)
    if (!product.incompleteQuantity && !product.needsQuantityUpdate) {
      return suggestions.filter(qty => qty <= product.stock);
    }
    
    return suggestions;
  };

  const suggestedQuantities = getSuggestedQuantities();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
          disabled={disabled}
        >
          <Plus className="h-2.5 w-2.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2" 
        side="top" 
        align="end"
        sideOffset={5}
      >
        <div className="grid grid-cols-3 gap-1">
          {suggestedQuantities.map((quantity) => (
            <Button
              key={quantity}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onAddQuantity(quantity)}
            >
              {quantity} {product.unit}
            </Button>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 text-center">
          Quick add quantities
        </div>
      </PopoverContent>
    </Popover>
  );
};