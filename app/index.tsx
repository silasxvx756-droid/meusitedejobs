import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GRAPHIC_DESIGN_ROLES = [
  { id: "ui_ux", label: "UI/UX Designer", icon: "📱" },
  { id: "brand", label: "Designer de Marca / Branding", icon: "🎨" },
  { id: "motion", label: "Motion Designer", icon: "🎬" },
  { id: "social", label: "Social Media Designer", icon: "📲" },
  { id: "illustrator", label: "Ilustrador(a) Digital", icon: "✏️" },
  { id: "3d", label: "Designer 3D", icon: "🧊" },
  { id: "art_director", label: "Diretor(a) de Arte", icon: "🎭" },
  { id: "print", label: "Designer Editorial / Gráfico", icon: "📚" },
];

export default function Page() {
  const [step, setStep] = useState<"name" | "email" | "role" | "instagram" | "summary">("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [hasFollowed, setHasFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para o Pop-up (Modal) do Instagram
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [instaHandle, setInstaHandle] = useState("");

  const instagramUrl = "https://www.instagram.com/conect_designer1/";
  const targetInstagramHandle = "@conect_designer1";

  // Animações
  const rolesListScale = useRef(new Animated.Value(1)).current;
  const rolesListRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleOpenInstagram = () => {
    Linking.openURL(instagramUrl);
  };

  const animateButtonPress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
    });
  };

  const animateRolesList = () => {
    rolesListScale.setValue(0.95);
    rolesListRotate.setValue(-1);

    Animated.parallel([
      Animated.spring(rolesListScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(rolesListRotate, {
        toValue: 0,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextName = () => {
    if (name.trim()) {
      animateButtonPress(() => setStep("email"));
    }
  };

  const handleNextEmail = () => {
    if (email.trim() && email.includes("@")) {
      animateButtonPress(() => setStep("role"));
    }
  };

  const handleNextRole = () => {
    if (selectedRole) {
      animateButtonPress(() => setStep("instagram"));
    }
  };

  // Função para enviar os dados para o seu e-mail via EmailJS
  const sendEmailToAdmin = async () => {
    setLoading(true);

    const payload = {
      service_id: "service_12t80yc",
      template_id: "template_wqs07v7", // ID atualizado do template
      user_id: "nzR9FrEWhw244hjKs",
      template_params: {
        user_name: name,
        user_email: email,
        user_role: getRoleLabel(selectedRole),
        user_instagram: instaHandle,
      },
    };

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStep("summary");
      } else {
        const errorText = await response.text();
        console.warn("Erro ao enviar pelo EmailJS:", errorText);
        setStep("summary");
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      setStep("summary");
    } finally {
      setLoading(false);
    }
  };

  const handleNextInstagram = () => {
    if (hasFollowed && instaHandle.trim()) {
      animateButtonPress(() => {
        sendEmailToAdmin();
      });
    }
  };

  const handleCheckboxClick = () => {
    if (hasFollowed) {
      setHasFollowed(false);
      setInstaHandle("");
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirmInstaHandle = () => {
    if (instaHandle.trim()) {
      setHasFollowed(true);
      setIsModalVisible(false);
    }
  };

  const handleReset = () => {
    animateButtonPress(() => {
      setStep("name");
      setName("");
      setEmail("");
      setSelectedRole("");
      setHasFollowed(false);
      setInstaHandle("");
    });
  };

  const getRoleLabel = (id: string) => {
    return GRAPHIC_DESIGN_ROLES.find((r) => r.id === id)?.label || id;
  };

  return (
    <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          {/* ETAPA 1: NOME */}
          {step === "name" && (
            <>
              <View style={styles.header}>
                <Text style={styles.badge}>PASSO 1 DE 4</Text>
                <Text style={styles.title}>Qual é o seu nome?</Text>
                <Text style={styles.subtitle}>
                  Digite seu nome para começar seu perfil de designer.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome aqui..."
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.button, !name.trim() && styles.buttonDisabled]}
                  onPress={handleNextName}
                  disabled={!name.trim()}
                >
                  <LinearGradient
                    colors={
                      name.trim() ? ["#6366f1", "#4f46e5"] : ["#334155", "#334155"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.buttonText}>Avançar →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}

          {/* ETAPA 2: E-MAIL */}
          {step === "email" && (
            <>
              <View style={styles.header}>
                <Text style={styles.badge}>PASSO 2 DE 4</Text>
                <Text style={styles.title}>Qual é o seu e-mail?</Text>
                <Text style={styles.subtitle}>
                  Utilizaremos para enviar atualizações do seu cadastro.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.backButton}
                  onPress={() => setStep("name")}
                >
                  <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <Animated.View style={[styles.flexButton, { transform: [{ scale: buttonScale }] }]}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.button,
                      (!email.trim() || !email.includes("@")) && styles.buttonDisabled,
                    ]}
                    onPress={handleNextEmail}
                    disabled={!email.trim() || !email.includes("@")}
                  >
                    <LinearGradient
                      colors={
                        email.trim() && email.includes("@")
                          ? ["#6366f1", "#4f46e5"]
                          : ["#334155", "#334155"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>Avançar →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}

          {/* ETAPA 3: ESCOLHER CARGO */}
          {step === "role" && (
            <>
              <View style={styles.header}>
                <Text style={styles.badge}>PASSO 3 DE 4</Text>
                <Text style={styles.title}>Selecione sua especialidade</Text>
                <Text style={styles.subtitle}>
                  Escolha o cargo que melhor define sua atuação em Design Gráfico.
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.rolesListContainer,
                  {
                    transform: [
                      { scale: rolesListScale },
                      {
                        rotate: rolesListRotate.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: ["-1deg", "0deg", "1deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <ScrollView
                  style={styles.rolesScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {GRAPHIC_DESIGN_ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <TouchableOpacity
                        key={role.id}
                        activeOpacity={0.7}
                        style={[
                          styles.roleOption,
                          isSelected && styles.roleOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedRole(role.id);
                          animateRolesList();
                        }}
                      >
                        <Text style={styles.roleIcon}>{role.icon}</Text>
                        <Text
                          style={[
                            styles.roleText,
                            isSelected && styles.roleTextSelected,
                          ]}
                        >
                          {role.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </Animated.View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.backButton}
                  onPress={() => setStep("email")}
                >
                  <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <Animated.View style={[styles.flexButton, { transform: [{ scale: buttonScale }] }]}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.button,
                      !selectedRole && styles.buttonDisabled,
                    ]}
                    onPress={handleNextRole}
                    disabled={!selectedRole}
                  >
                    <LinearGradient
                      colors={
                        selectedRole
                          ? ["#6366f1", "#4f46e5"]
                          : ["#334155", "#334155"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>Avançar →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}

          {/* ETAPA 4: INSTAGRAM */}
          {step === "instagram" && (
            <>
              <View style={styles.header}>
                <Text style={styles.badge}>PASSO 4 DE 4</Text>
                <Text style={styles.title}>Siga no Instagram</Text>
                <Text style={styles.subtitle}>
                  Siga o perfil <Text style={styles.highlightText}>{targetInstagramHandle}</Text> e confirme abaixo para continuar.
                </Text>
              </View>

              <View style={styles.instagramContent}>
                <TouchableOpacity
                  style={styles.instaButton}
                  activeOpacity={0.8}
                  onPress={handleOpenInstagram}
                >
                  <Text style={styles.instaButtonText}>📸 Abrir Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxContainer}
                  activeOpacity={0.8}
                  onPress={handleCheckboxClick}
                >
                  <View style={[styles.checkbox, hasFollowed && styles.checkboxChecked]}>
                    {hasFollowed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {hasFollowed
                      ? `Seguindo como: ${instaHandle}`
                      : `Já segui ${targetInstagramHandle}`}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.backButton}
                  onPress={() => setStep("role")}
                >
                  <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <Animated.View style={[styles.flexButton, { transform: [{ scale: buttonScale }] }]}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.button,
                      (!hasFollowed || loading) && styles.buttonDisabled,
                    ]}
                    onPress={handleNextInstagram}
                    disabled={!hasFollowed || loading}
                  >
                    <LinearGradient
                      colors={
                        hasFollowed
                          ? ["#6366f1", "#4f46e5"]
                          : ["#334155", "#334155"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Concluir →</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}

          {/* RESUMO FINAL */}
          {step === "summary" && (
            <>
              <View style={styles.header}>
                <Text style={styles.badge}>TUDO PRONTO!</Text>
                <Text style={styles.title}>Parabéns, {name}! 🎉</Text>
                <Text style={styles.subtitle}>
                  Seu cadastro como <Text style={styles.highlightText}>{getRoleLabel(selectedRole)}</Text> foi finalizado com o Instagram <Text style={styles.highlightText}>{instaHandle}</Text>!
                </Text>
              </View>

              <View style={styles.noticeCard}>
                <Text style={styles.noticeIcon}>📩</Text>
                <Text style={styles.noticeText}>
                  Entrarei em contato pelo e-mail para conversarmos melhor sobre o trabalho. 
                </Text>
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.button}
                  onPress={handleReset}
                >
                  <View style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Recomeçar</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </View>

        {/* POP-UP (MODAL) PARA VALIDAÇÃO DO INSTAGRAM */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalBadge}>VALIDAÇÃO</Text>
              <Text style={styles.modalTitle}>Qual o seu @usuario?</Text>
              <Text style={styles.modalSubtitle}>
                Informe o seu nome de usuário no Instagram que usou para seguir {targetInstagramHandle}:
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="@seu.usuario"
                placeholderTextColor="#64748b"
                value={instaHandle}
                onChangeText={setInstaHandle}
                autoCapitalize="none"
              />

              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    setInstaHandle("");
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalConfirmButton,
                    !instaHandle.trim() && styles.buttonDisabled,
                  ]}
                  disabled={!instaHandle.trim()}
                  onPress={handleConfirmInstaHandle}
                >
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#94a3b8",
    lineHeight: 22,
  },
  highlightText: {
    color: "#818cf8",
    fontWeight: "700",
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#f8fafc",
    borderWidth: 1,
    borderColor: "#334155",
  },
  rolesListContainer: {
    maxHeight: 280,
    marginBottom: 20,
  },
  rolesScrollView: {
    flex: 1,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
  },
  roleOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
  roleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  roleText: {
    fontSize: 15,
    color: "#94a3b8",
    fontWeight: "500",
  },
  roleTextSelected: {
    color: "#f8fafc",
    fontWeight: "700",
  },
  instagramContent: {
    marginBottom: 24,
    gap: 16,
  },
  instaButton: {
    height: 56,
    backgroundColor: "#E1306C",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E1306C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  instaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxLabel: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 24,
    gap: 12,
  },
  noticeIcon: {
    fontSize: 24,
  },
  noticeText: {
    flex: 1,
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
  backButton: {
    height: 56,
    paddingHorizontal: 20,
    backgroundColor: "#334155",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    borderRadius: 14,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 56,
    backgroundColor: "#334155",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalBadge: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 20,
    marginBottom: 18,
  },
  modalInput: {
    height: 52,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#f8fafc",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  modalButtonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#334155",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
  },
  modalConfirmButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalConfirmButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});