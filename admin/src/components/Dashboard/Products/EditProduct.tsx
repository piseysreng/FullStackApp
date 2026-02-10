'use client'

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Assuming you have a textarea
import { updateProductAction } from "@/src/actions/productAction" // You'll need to create this
import { toast } from "sonner" // Or your preferred toast library
import { updateProductSchema } from "@/src/schemas/schema"
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { listCategory } from "@/src/actions/categoryAction"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { CategoryType } from "@/src/db/schema"
import { ProductWithRelations, UpdateProductType } from "@/src/types/types"

interface EditProductFormProps {
  id: string;
  fetchedProduct: ProductWithRelations;
  onSuccess?: () => void;
}

export function EditProductForm({ id, fetchedProduct, onSuccess }: EditProductFormProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await listCategory();
      setCategories(data);
    };
    fetchCategories();
  }, []);
  const form = useForm({
    defaultValues: {
      isPublished: fetchedProduct?.isPublished ?? false,
      name: fetchedProduct?.name ?? '',
      price: fetchedProduct?.price ?? 0,
      sku: fetchedProduct?.sku ?? '',
      description: fetchedProduct?.description ?? '',
      stockQuantity: fetchedProduct?.stockQuantity ?? 0,
      featureImage: fetchedProduct?.featureImage || undefined,
      galleryImages: fetchedProduct?.galleryImages ?? [],
      categories: fetchedProduct?.categories?.map((cat: any) => Number(cat.id)) ?? [],
    } as UpdateProductType,
    validators: {
      onChange: updateProductSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        // 1. Append simple fields
        formData.append("isPublished", String(value.isPublished));
        formData.append("name", value.name);
        formData.append("price", String(value.price));
        formData.append("sku", value.sku || "");
        formData.append("description", value.description || "");
        formData.append("stockQuantity", String(value.stockQuantity));
        value.categories?.forEach((id) => {
          formData.append("categories", String(id));
        });

        // value.galleryImages?.forEach((img) => {
        //   // If gallery images can also be files, check instance here too
        //   formData.append("galleryImages", img);
        // });

        if (value.galleryImages && value.galleryImages.length > 0) {
          value.galleryImages.forEach((file) => {
            formData.append("galleryImages", file);
          });
        }
        if (value.featureImage) {
          formData.append("featureImage", value.featureImage);
        }
        // 4. Send the FormData to your action
        await updateProductAction(Number(id), formData);

        toast.success("Product updated successfully");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to update product");
        console.error(error);
      }
    },
  })

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <FieldGroup className="space-y-4">
          <form.Field name="isPublished">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-base">Published</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      Control if this product is visible to customers.
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Switch
                      id={field.name}
                      // Bind to the boolean value in form state
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      // Pass the boolean directly to handleChange
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </div>
                </Field>
              )
            }}
          </form.Field>
          {/* Product Name */}
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel>Product Name</FieldLabel>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <form.Field name="price">
              {(field) => (
                <Field>
                  <FieldLabel>Price</FieldLabel>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Quantity */}
            <form.Field name="stockQuantity">
              {(field) => (
                <Field>
                  <FieldLabel>Stock Quantity</FieldLabel>
                  <Input
                    type="number"
                    step="1"
                    min="0" // Standard HTML constraint for minimum value
                    onKeyDown={(e) => {
                      // Prevent comma, period, and the minus (-) key
                      if (e.key === ',' || e.key === '.' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    value={field.state.value || 0}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseInt(val, 10);

                      // Ensure the value is at least 0 if it's a valid number
                      const finalValue = isNaN(parsed) ? 0 : Math.max(0, parsed);

                      field.handleChange(finalValue);
                    }}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field
            name="categories"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedValues = new Set((field.state.value as number[]) || []);

              const toggleCategory = (id: number) => {
                const nextValue = selectedValues.has(id)
                  ? Array.from(selectedValues).filter((v) => v !== id)
                  : [...Array.from(selectedValues), id];
                field.handleChange(nextValue);
              };

              return (
                <Field data-invalid={isInvalid} className="flex flex-col gap-2">
                  <FieldLabel>Categories</FieldLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <div
                        role="combobox"
                        tabIndex={0}
                        className="flex items-center justify-between h-auto min-h-10 w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex flex-wrap gap-1">
                          {selectedValues.size > 0 ? (
                            categories
                              .filter((c) => selectedValues.has(c.id))
                              .map((c) => (
                                <Badge variant="secondary" key={c.id} className="pr-1 font-normal">
                                  {c.name}
                                  <button
                                    type="button"
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCategory(c.id);
                                    }}
                                  >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </Badge>
                              ))
                          ) : (
                            <span className="text-muted-foreground">Select categories...</span>
                          )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      align="start"
                    >
                      <Command className="flex flex-col">
                        <CommandInput placeholder="Search categories..." />
                        {/* FIX: We use CommandList with a fixed height and 
                  ensure it handles overflow correctly. 
              */}
                        <CommandList className="max-h-75 overflow-y-auto overflow-x-hidden">
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                // Use onSelect carefully with checkboxes
                                onSelect={() => toggleCategory(category.id)}
                                className="cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    selectedValues.has(category.id)
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                >
                                  <Check className="h-4 w-4" />
                                </div>
                                <span className="flex-1">{category.name}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* SKU */}
          <form.Field name="sku">
            {(field) => (
              <Field>
                <FieldLabel>SKU</FieldLabel>
                <Input
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          {/* Featured Image URL */}
          <form.Field name="featureImage">
            {(field) => {
              const value = field.state.value;
              // Create a local preview URL if it's a File object, otherwise use the string URL
              const previewUrl = value instanceof File
                ? URL.createObjectURL(value)
                : (typeof value === 'string' ? value : null);

              return (
                <Field className="space-y-2">
                  <FieldLabel>Featured Image</FieldLabel>

                  <div className="flex flex-col items-start gap-4">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      id="featureImageInput"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.handleChange(file);
                      }}
                    />

                    {/* Clickable Preview Area */}
                    <div
                      onClick={() => document.getElementById('featureImageInput')?.click()}
                      className="relative group cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all rounded-lg overflow-hidden w-40 h-40 flex items-center justify-center bg-muted/30"
                    >
                      {previewUrl ? (
                        <>
                          <img
                            src={previewUrl}
                            alt="Feature Preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay on Hover */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Plus className="h-8 w-8" />
                          <span className="text-xs">Upload Image</span>
                        </div>
                      )}
                    </div>

                    {/* Reset button - only shows if they've selected a new file */}
                    {value instanceof File && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => field.handleChange(fetchedProduct?.featureImage ?? '')}
                      >
                        Reset to original
                      </Button>
                    )}
                  </div>

                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>


        {/* GALLERY IMAGES SECTION */}
        {/* <form.Field name="galleryImages">
          {(field) => {
            const images = field.state.value || [];

            const addImage = () => field.handleChange([...images, ""]);

            const removeImage = (index: number) => {
              field.handleChange(images.filter((_, i) => i !== index));
            };

            const updateImage = (index: number, value: string) => {
              const newImages = [...images];
              newImages[index] = value;
              field.handleChange(newImages);
            };

            return (
              <div className="space-y-3">
                <FieldLabel>Gallery Images</FieldLabel>

                <div className="grid gap-3">
                  {images.map((url: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={url}
                          onChange={(e) => updateImage(index, e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={addImage}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Gallery Image URL
                </Button>
                <FieldError errors={field.state.meta.errors} />
              </div>
            );
          }}
        </form.Field> */}

        <form.Field name="galleryImages">
          {(field) => {
            // Cast to (string | File)[] since our state now handles both
            const images = (field.state.value as (string | File)[]) || [];

            const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (files) {
                // Add new files to the existing list (keeps old URLs + adds new Files)
                field.handleChange([...images, ...Array.from(files)]);
              }
              e.target.value = ""; // Reset input so same file can be picked again
            };

            const removeImage = (index: number) => {
              field.handleChange(images.filter((_, i) => i !== index));
            };

            return (
              <div className="space-y-3">
                <FieldLabel>Gallery Images</FieldLabel>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((img, index) => {
                    // Logic for preview: if it's a File, create a blob URL; if string, use it directly
                    const previewUrl = img instanceof File
                      ? URL.createObjectURL(img)
                      : img;

                    return (
                      <div key={index} className="relative aspect-square group rounded-lg border bg-muted overflow-hidden">
                        <img
                          src={previewUrl}
                          alt={`Gallery ${index}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />

                        {/* Remove Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Image Placeholder / Button */}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 cursor-pointer rounded-lg transition-all group">
                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary mt-1">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileAdd}
                    />
                  </label>
                </div>

                <FieldError errors={field.state.meta.errors} />
              </div>
            );
          }}
        </form.Field>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

