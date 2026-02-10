"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { createCategory } from "@/src/actions/categoryAction" // Updated action
import { createCategorySchema, createProductSchema, NewCreateProductSchema } from "@/src/schemas/schema" // Updated schema
import { z } from "zod"
import { CreateCategoryType, CreateProductType, NewCreateProductType } from "@/src/types/types"
import { createCategory, listCategory } from "@/src/actions/categoryAction"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { CategoryType } from "@/src/db/schema"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { createProduct } from "@/src/actions/productAction"
import { Switch } from "@/components/ui/switch"

// Infer the type from your schema
// type CreateCategoryType = z.infer<typeof createCategorySchema>;

const defaultCategory: CreateProductType = {
  name: '',
  price: 0,
  categories: [],
  featureImage: null,
  galleryImages: [],
  sku: '',
  description: '',
  stockQuantity: 0,
  isPublished: false
}

export function CreateProductForm() {

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await listCategory();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const form = useForm({
    defaultValues: defaultCategory,
    validators: {
      onChange: createProductSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("categories", JSON.stringify(value.categories));
        formData.append("price", value.price.toString());
        if (value.featureImage instanceof File) {
          formData.append("featureImage", value.featureImage);
        }
        if (value.stockQuantity !== undefined && value.stockQuantity !== null) {
          formData.append("stockQuantity", value.stockQuantity.toString());
        }
        formData.append("sku", value.sku || "");
        formData.append("description", value.description || "");
        if (value.galleryImages && value.galleryImages.length > 0) {
          value.galleryImages.forEach((file) => {
            formData.append("galleryImages", file);
          });
        }
        if (value.isPublished !== undefined) {
          formData.append("isPublished", String(value.isPublished));
        }

        const result = await createProduct(formData);
        if (result.success) {
          alert("Category created successfully!");
          form.reset();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error("Submission Error:", err);
        alert("An unexpected error occurred during creation.");
        console.error("FULL ERROR DETAILS:", err);

        if (err instanceof Error) {
          alert(`Error: ${err.message}`);
        } else {
          alert("An unexpected error occurred during creation.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="space-y-4">
            <form.Field
              name="isPublished"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FieldLabel htmlFor={field.name}>Published Status</FieldLabel>
                      <p className="text-sm text-muted-foreground">
                        Make this product visible in the store.
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Switch
                        id={field.name}
                        // Use field.state.value (boolean) for the switch state
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        // TanStack Form handleChange updates the boolean value
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  </Field>
                )
              }}
            />
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Electronics"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name="categories"
              children={(field) => {
                const selectedValues = new Set(field.state.value || []);
                const toggleCategory = (id: number) => {
                  const next = selectedValues.has(id)
                    ? [...selectedValues].filter((v) => v !== id)
                    : [...selectedValues, id];
                  field.handleChange(next);
                };

                return (
                  <Field className="flex flex-col gap-2">
                    <FieldLabel>Categories</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex items-center justify-between border p-2 rounded-md cursor-pointer text-sm">
                          {selectedValues.size > 0 ? `${selectedValues.size} selected` : "Select..."}
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput />
                          <CommandList>
                            <CommandGroup>
                              {categories.map((c) => (
                                <CommandItem key={c.id} onSelect={() => toggleCategory(c.id)}>
                                  <Check className={cn("mr-2 h-4 w-4", selectedValues.has(c.id) ? "opacity-100" : "opacity-0")} />
                                  {c.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />


            <form.Field name="price">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <div className="relative">
                      {/* Visual Currency Symbol */}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id={field.name}
                        className="pl-7" // Add padding so text doesn't overlap the "$"
                        type="number"
                        step="0.01" // Allows two decimal places
                        min="0"    // Prevents negative prices
                        placeholder="0.00"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onKeyDown={(e) => {
                          // Prevent negative sign
                          if (e.key === '-') e.preventDefault();
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          // If the field is empty, set to 0, otherwise parse as float
                          const parsed = val === "" ? 0 : parseFloat(val);
                          field.handleChange(parsed);
                        }}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>


            <form.Field name="stockQuantity">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                    <div className="relative">
                      {/* Visual Icon Prefix (Optional, for consistency with Price) */}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                        QTY
                      </span>
                      <Input
                        id={field.name}
                        name={field.name}
                        className="pl-12" // Extra padding for the "QTY" prefix
                        type="number"
                        step="1"          // Only whole numbers
                        min="0"           // Minimum value 0
                        value={field.state.value || 0}
                        onBlur={field.handleBlur}
                        onKeyDown={(e) => {
                          // Prevent decimals (.), commas (,), and negative signs (-)
                          if (["-", ".", ","].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Parse as integer and ensure it doesn't go below 0
                          const parsed = val === "" ? 0 : parseInt(val, 10);
                          field.handleChange(isNaN(parsed) ? 0 : Math.max(0, parsed));
                        }}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="sku"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Sku</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={undefined}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Please put Category Name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={undefined}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Please put Category Name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />



            {/* Feature Image Field */}
            <form.Field
              name="featureImage"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Product Image</FieldLabel>
                    <Input
                      id={field.name}
                      type="file"
                      accept="image/*"
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.handleChange(file);
                      }}
                    />
                    {field.state.value && (
                      <p className="text-[12px] text-muted-foreground mt-2">
                        Selected: {(field.state.value as File).name}
                      </p>
                    )}
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="galleryImages"
              children={(field) => {
                // Check if the field has been touched and has validation errors
                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Gallery Images</FieldLabel>
                    <Input
                      id={field.name}
                      type="file"
                      accept="image/*"
                      multiple // This allows the user to select more than one file
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        // Convert FileList to a standard Array for TanStack Form
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        field.handleChange(files);
                      }}
                    />

                    {/* Display the list of selected file names */}
                    {field.state.value && field.state.value.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[12px] font-medium text-muted-foreground">
                          Selected ({field.state.value.length}):
                        </p>
                        <ul className="text-[12px] text-muted-foreground list-disc pl-4">
                          {field.state.value.map((file: File, index: number) => (
                            <li key={`${file.name}-${index}`}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />


          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="category-form">
          Create Category
        </Button>
      </CardFooter>
    </Card>
  )
}