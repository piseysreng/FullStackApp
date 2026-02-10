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
import { createCategorySchema } from "@/src/schemas/schema" // Updated schema
import { z } from "zod"
import { CreateCategoryType } from "@/src/types/types"
import { createCategory, listCategory } from "@/src/actions/categoryAction"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { CategoryType } from "@/src/db/schema"

// Infer the type from your schema
// type CreateCategoryType = z.infer<typeof createCategorySchema>;

const defaultCategory: CreateCategoryType = {
  name: '',
  description: '',
  image: null,
  parentId: null
}

export function CreateCategoryForm() {

  const [categories, setCategories] = useState<CategoryType[]>([]);

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
      onChange: createCategorySchema,
    },
    onSubmit: async ({ value }) => {
      // const { name, description, image, parentId } = value;
      // createCategory(name, description, image, parentId);

      try {
        // You might want to add a 'loading' state here
        const result = await createCategory(
          value.name,
          value.description,
          value.image as File | null,
          value.parentId
        );

        if (result.success) {
          // Success logic (e.g., toast notification or router.push)
          alert("Category created successfully!");
          form.reset();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        alert("An unexpected error occurred.");
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
            {/* Category Name */}
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



            {/* Parent Category ID */}
            <form.Field
              name="parentId"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="space-y-2">
                    <FieldLabel htmlFor={field.name}>Parent Category</FieldLabel>

                    <Select
                      // Shadcn Select expects a string value
                      value={field.state.value?.toString() || "none"}
                      onValueChange={(val) => {
                        // If "none" is selected, set to null, otherwise parse the ID number
                        const result = val === "none" ? null : parseInt(val, 10);
                        field.handleChange(result);
                      }}
                    >
                      <SelectTrigger id={field.name} className={isInvalid ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">None (Top-level)</SelectItem>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </div>
                );
              }}
            />

            {/* Description */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Category details..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            {/* Category Image */}
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Select Category Image</FieldLabel>
                    <Input
                      id={field.name}
                      type="file" // Changes the input type to file picker
                      accept="image/*" // Restricts selection to image files
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        // Grab the first file from the file list
                        const file = e.target.files?.[0];
                        if (file) {
                          field.handleChange(file);
                        }
                      }}
                    />

                    {/* Optional: Preview the selected image name or a thumbnail */}
                    {field.state.value && (
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>
                        Selected: {(field.state.value as File).name}
                      </p>
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