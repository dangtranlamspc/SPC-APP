import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Category = {
    _id: string;
    name: string;
}

export default function CategoryForHome() {

    const baseUrl = 'http://localhost:4000/api';
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${baseUrl}/categories`)
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.log('Error fetching categories: ', error)
        }
    }

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => router.push(`/productbycategory/${item._id}`)}
        >
            <Text style={styles.categoryIcon}>🌱</Text>
            <Text style={styles.categoryLabel}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Danh Mục Sản Phẩm</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.categoriesGrid}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FA" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  categoriesGrid: { justifyContent: "space-between", marginBottom: 12 },
  categoryItem: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  categoryIcon: { fontSize: 28, marginBottom: 8 },
  categoryLabel: { fontSize: 16, fontWeight: "500" },
});