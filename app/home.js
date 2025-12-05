// app/home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { db, auth } from "../firebaseconfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { getUser, clearUser } from "../storage";
import { signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [prodi, setProdi] = useState("");
  const [list, setList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getUser();
      if (!saved) router.replace("/login");
      setUser(saved);
      setLoadingUser(false);
    })();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "mahasiswa"), (snap) => {
      setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const tambah = async () => {
    if (!nama || !nim || !prodi) return alert("Harap isi semua field!");

    setSaving(true);
    await addDoc(collection(db, "mahasiswa"), {
      nama,
      nim,
      prodi,
      createdAt: new Date(),
    });
    setNama("");
    setNim("");
    setProdi("");
    setSaving(false);
  };

  const logout = async () => {
    await clearUser();
    await signOut(auth);
    router.replace("/login");
  };

  if (loadingUser)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00e5ff" />
      </View>
    );

  return (
    <LinearGradient
      colors={["#0ea5e9", "#38bdf8", "#06b6d4"]}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tambah Mahasiswa</Text>

          <TextInput
            placeholder="Nama"
            style={styles.input}
            value={nama}
            onChangeText={setNama}
          />
          <TextInput
            placeholder="NIM"
            style={styles.input}
            value={nim}
            onChangeText={setNim}
          />
          <TextInput
            placeholder="Prodi"
            style={styles.input}
            value={prodi}
            onChangeText={setProdi}
          />

          <TouchableOpacity style={styles.button} onPress={tambah}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daftar Mahasiswa</Text>

          <FlatList
            data={list}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.nama}</Text>
                <Text style={styles.itemSub}>
                  NIM: {item.nim} • Prodi: {item.prodi}
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    marginTop: 40,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 26, fontWeight: "700", color: "#fff" },
  logout: { color: "#fff", fontWeight: "600" },
  card: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 18,
    borderRadius: 16,
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0284c7",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  itemTitle: { fontSize: 16, color: "#fff", fontWeight: "600" },
  itemSub: { color: "#e2e8f0", fontSize: 12 },
});
