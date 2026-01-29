import { ProductFormSchema, UpdateProductFormSchema } from "./components";

export function buildProductFormData(form: ProductFormSchema) {
  const fd = new FormData();

  fd.append("Slug", form.slug);
  fd.append("Price", String(form.price));
  if (form.newPrice != null) fd.append("NewPrice", String(form.newPrice));
  fd.append("Brand", form.brand);
  fd.append("Category", form.category);
  fd.append("SubCategory", form.subCategory);
  fd.append("Type", form.type);
  fd.append("SubType", form.subType);
  fd.append("Description", form.description);

  (form.detailsAttributes || []).forEach((attr, i) => {
    fd.append(`DetailsAttributes[${i}].Name`, attr.name);
    fd.append(`DetailsAttributes[${i}].Description`, attr.description);
  });

  (form.sizeFitAttributes || []).forEach((attr, i) => {
    fd.append(`SizeFitAttributes[${i}].Name`, attr.name);
    fd.append(`SizeFitAttributes[${i}].Description`, attr.description);
  });

  (form.materialDetails || []).forEach((mat, i) => {
    fd.append(`MaterialDetails[${i}].Material`, mat.material);
    fd.append(`MaterialDetails[${i}].Percentage`, String(mat.percentage));
    fd.append(`MaterialDetails[${i}].Detail`, mat.detail);
  });

  for (const file of form.images || []) {
    fd.append("Images", file);
  }

  (form.isMain || []).forEach((b, index) => {
    fd.append(`IsMain[${index}]`, String(b));
  });

  (form.variants || []).forEach((v, i) => {
    fd.append(`Variants[${i}].Color`, v.color);

    (v.images || []).forEach((file) => {
      fd.append(`Variants[${i}].Images`, file);
    });

    (v.isMain || []).forEach((b, j) => {
      fd.append(`Variants[${i}].IsMain[${j}]`, String(b));
    });
  });

  return fd;
}
export const buildUpdateProductFormData = (form: UpdateProductFormSchema) => {
  const fd = new FormData();

  fd.append("ProductId", form.productId);
  fd.append("Slug", form.slug);
  fd.append("Price", String(form.price));
  if (form.newPrice != null) fd.append("NewPrice", String(form.newPrice));
  fd.append("Brand", form.brand);
  fd.append("Category", form.category);
  fd.append("SubCategory", form.subCategory);
  fd.append("Type", form.type);
  fd.append("SubType", form.subType);
  fd.append("Description", form.description);

  fd.append("IsFeatured", String(form.isFeatured ?? false));
  fd.append("IsNew", String(form.isNew ?? false));
  fd.append("IsBestSeller", String(form.isBestSeller ?? false));
  fd.append("IsTrending", String(form.isTrending ?? false));

  (form.detailsAttributes || []).forEach((attr, i) => {
    fd.append(`DetailsAttributes[${i}].Name`, attr.name);
    fd.append(`DetailsAttributes[${i}].Description`, attr.description);
  });

  (form.sizeFitAttributes || []).forEach((attr, i) => {
    fd.append(`SizeFitAttributes[${i}].Name`, attr.name);
    fd.append(`SizeFitAttributes[${i}].Description`, attr.description);
  });

  (form.materialDetails || []).forEach((mat, i) => {
    fd.append(`MaterialDetails[${i}].Material`, mat.material);
    fd.append(`MaterialDetails[${i}].Percentage`, String(mat.percentage));
    fd.append(`MaterialDetails[${i}].Detail`, mat.detail);
  });

  form.imageDtos.forEach((img, i) => {
    fd.append(`ImageDtos[${i}].ProductImageId`, img.productImageId);
    fd.append(`ImageDtos[${i}].Url`, img.url || "");
    fd.append(`ImageDtos[${i}].AltText`, img.altText || "");
    fd.append(`ImageDtos[${i}].IsMain`, String(img.isMain));
    fd.append(`ImageDtos[${i}].IsDeleted`, String(img.isDeleted || false));
  });

  const newImages = form.images || [];
  if (newImages.length > 0) {
    for (const file of newImages) {
      fd.append("Images", file);
    }
  }

  const isMainFlags = form.isMain || [];
  if (isMainFlags.length > 0) {
    isMainFlags.forEach((b, index) => {
      fd.append(`IsMain[${index}]`, String(b));
    });
  }

  (form.variants || []).forEach((v, i) => {
    if (v.isDeleted) {
      fd.append(`Variants[${i}].IsDeleted`, String(true));
      if (v.variantId) fd.append(`Variants[${i}].VariantId`, v.variantId);
      return;
    }

    if (v.variantId) fd.append(`Variants[${i}].VariantId`, v.variantId);
    fd.append(`Variants[${i}].Color`, v.color);

    if (v.sizeVariants && v.sizeVariants.length > 0) {
      v.sizeVariants.forEach((sv, j) => {
        if (sv.isDeleted) {
          fd.append(
            `Variants[${i}].SizeVariants[${j}].IsDeleted`,
            String(true)
          );
          if (sv.sizeVariantId) {
            fd.append(
              `Variants[${i}].SizeVariants[${j}].SizeVariantId`,
              sv.sizeVariantId
            );
          }
          return;
        }

        if (sv.sizeVariantId) {
          fd.append(
            `Variants[${i}].SizeVariants[${j}].SizeVariantId`,
            sv.sizeVariantId
          );
        }
        fd.append(`Variants[${i}].SizeVariants[${j}].Size`, sv.size);
        fd.append(`Variants[${i}].SizeVariants[${j}].Stock`, String(sv.stock));
        fd.append(
          `Variants[${i}].SizeVariants[${j}].StockLow`,
          String(sv.stockLow ?? 0)
        );
        fd.append(
          `Variants[${i}].SizeVariants[${j}].StockMid`,
          String(sv.stockMid ?? 0)
        );
        fd.append(
          `Variants[${i}].SizeVariants[${j}].StockHigh`,
          String(sv.stockHigh ?? 0)
        );
      });
    }

    const variantImageDtos = v.imageDtos || [];
    if (variantImageDtos.length === 0) {
      fd.append(`Variants[${i}].ImageDtos[0]`, "");
    } else {
      variantImageDtos.forEach((img, j) => {
        fd.append(
          `Variants[${i}].ImageDtos[${j}].ProductImageId`,
          img.productImageId
        );
        fd.append(`Variants[${i}].ImageDtos[${j}].Url`, img.url || "");
        fd.append(`Variants[${i}].ImageDtos[${j}].AltText`, img.altText || "");
        fd.append(`Variants[${i}].ImageDtos[${j}].IsMain`, String(img.isMain));
        fd.append(
          `Variants[${i}].ImageDtos[${j}].IsDeleted`,
          String(img.isDeleted || false)
        );
      });
    }

    const variantImages = v.images || [];
    if (variantImages.length > 0) {
      variantImages.forEach((file) => {
        fd.append(`Variants[${i}].Images`, file);
      });
    }

    const variantIsMain = v.isMain || [];
    if (variantIsMain.length > 0) {
      variantIsMain.forEach((b, j) => {
        fd.append(`Variants[${i}].IsMain[${j}]`, String(b));
      });
    }
  });

  const alternatives = form.alternativesIds || [];
  alternatives.forEach((id, i) => {
    fd.append(`AlternativesIds[${i}]`, id);
  });

  return fd;
};
