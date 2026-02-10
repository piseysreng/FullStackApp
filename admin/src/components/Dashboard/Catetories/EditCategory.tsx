'use client'

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { updateCategoryAction } from "@/src/actions/categoryAction" // Category specific action
import { toast } from "sonner"
import { updateCategorySchema } from "@/src/schemas/schema" // Category specific schema
import { listCategory, updateCategoryAction } from "@/src/actions/categoryAction"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryType } from "@/src/db/schema"
import { UpdateCategoryType } from "@/src/types/types"

interface EditCategoryFormProps {
  id: string;
  fetchedCategory: CategoryType; // Using Category type instead of Product
  onSuccess?: () => void;
}

// export function EditCategoryForm({ id, fetchedCategory, onSuccess }: EditCategoryFormProps) {

//   const [categories, setCategories] = useState<CategoryType[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const data = await listCategory();
//       setCategories(data);
//     };
//     fetchCategories();
//   }, []);

//   const form = useForm({
//     defaultValues: {
//       name: fetchedCategory?.name ?? '',
//       description: fetchedCategory?.description ?? '',
//       image: fetchedCategory?.image ?? '',
//       parentId: fetchedCategory?.parentId ?? null,
//     } as UpdateCategoryType,
//     validators: {
//       onChange: updateCategorySchema,
//     },
//     onSubmit: async ({ value }) => {
//       // console.log(value);
//       try {
//         // Calling UpdateCategoryAction
//         await updateCategoryAction(Number(id), value);
//         toast.success("Category updated successfully");
//         if (onSuccess) onSuccess();
//       } catch (error) {
//         toast.error("Failed to update category");
//         console.error(error);
//       }
//     },
//   })

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           e.stopPropagation()
//           form.handleSubmit()
//         }}
//         className="space-y-4"
//       >
//         <FieldGroup className="space-y-4">

//           {/* Category Name */}
//           <form.Field name="name">
//             {(field) => (
//               <Field>
//                 <FieldLabel>Category Name</FieldLabel>
//                 <Input
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                 />
//                 <FieldError errors={field.state.meta.errors} />
//               </Field>
//             )}
//           </form.Field>

//           {/* Parent Category ID */}
//           <form.Field
//             name="parentId"
//             children={(field) => {
//               const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

//               return (
//                 <div className="space-y-2">
//                   <FieldLabel htmlFor={field.name}>Parent Category</FieldLabel>

//                   <Select
//                     // Shadcn Select expects a string value
//                     value={field.state.value?.toString() || "none"}
//                     onValueChange={(val) => {
//                       // If "none" is selected, set to null, otherwise parse the ID number
//                       const result = val === "none" ? null : parseInt(val, 10);
//                       field.handleChange(result);
//                     }}
//                   >
//                     <SelectTrigger id={field.name} className={isInvalid ? "border-destructive" : ""}>
//                       <SelectValue placeholder="Select a parent category" />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="none">None (Top-level)</SelectItem>
//                       {categories.map((category) => (
//                         <SelectItem
//                           key={category.id}
//                           value={category.id.toString()}
//                         >
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   {isInvalid && <FieldError errors={field.state.meta.errors} />}
//                 </div>
//               );
//             }}
//           />

//           {/* Description */}
//           <form.Field name="description">
//             {(field) => (
//               <Field>
//                 <FieldLabel>Description</FieldLabel>
//                 <Textarea
//                   value={field.state.value ?? ''}
//                   onBlur={field.handleBlur}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   placeholder="Category description..."
//                 />
//                 <FieldError errors={field.state.meta.errors} />
//               </Field>
//             )}
//           </form.Field>

//           {/* Category Image URL */}
//           <form.Field name="image">
//             {(field) => (
//               <Field>
//                 <FieldLabel>Category Image URL</FieldLabel>
//                 <Input
//                   value={field.state.value ?? ''}
//                   onBlur={field.handleBlur}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   placeholder="https://example.com/category.jpg"
//                 />
//                 <FieldError errors={field.state.meta.errors} />
//               </Field>
//             )}
//           </form.Field>

//         </FieldGroup>

//         <div className="flex justify-end gap-2 pt-4">
//           <Button type="submit" className="w-full">
//             Save Changes
//           </Button>
//         </div>
//       </form>
//     </div>
//   )
// }

export function EditCategoryForm({ id, fetchedCategory, onSuccess }: EditCategoryFormProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await listCategory();
      // Filter out the current category so you can't set a category as its own parent
      setCategories(data.filter((c: any) => c.id !== Number(id)));
    };
    fetchCategories();
  }, [id]);

  const form = useForm({
    defaultValues: {
      name: fetchedCategory?.name ?? '',
      description: fetchedCategory?.description ?? '',
      image: fetchedCategory?.image ?? '', // This starts as a string URL
      parentId: fetchedCategory?.parentId ?? null,
    } as any, // Use any or a flexible type to allow File | string
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await updateCategoryAction(Number(id), value);
        toast.success("Category updated successfully");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to update category");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup className="space-y-4">
          {/* Category Name */}
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel>Category Name</FieldLabel>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

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
          <form.Field name="description">
            {(field) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Category description..."
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          {/* Category Image Field */}
          <form.Field name="image">
            {(field) => (
              <Field>
                <FieldLabel>Category Image</FieldLabel>

                {/* Preview existing image if it's a string URL */}
                {typeof field.state.value === 'string' && field.state.value && (
                  <div className="mb-2">
                    <img
                      src={field.state.value}
                      alt="Current"
                      className="h-20 w-20 object-cover rounded border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Current Image</p>
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) field.handleChange(file);
                  }}
                />

                {field.state.value instanceof File && (
                  <p className="text-xs text-blue-600 mt-1">
                    New file selected: {field.state.value.name}
                  </p>
                )}
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}