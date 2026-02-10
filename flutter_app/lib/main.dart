import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

const adminIds = {'boxit'};

void main() {
  runApp(const BoxitApp());
}

class BoxitApp extends StatelessWidget {
  const BoxitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BOXIT 로그인',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFEF6C00)),
        useMaterial3: true,
      ),
      home: const AuthPage(),
    );
  }
}

class AuthStore {
  static const _usersKey = 'users_json';

  Future<Map<String, String>> loadUsers() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_usersKey);
    if (raw == null || raw.trim().isEmpty) return {};
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return decoded.map((key, value) => MapEntry(key, value as String));
  }

  Future<void> saveUsers(Map<String, String> users) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_usersKey, jsonEncode(users));
  }
}

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _store = AuthStore();
  final _loginId = TextEditingController();
  final _loginPw = TextEditingController();
  final _signupId = TextEditingController();
  final _signupPw = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _loginId.dispose();
    _loginPw.dispose();
    _signupId.dispose();
    _signupPw.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() => _loading = true);
    final id = _loginId.text.trim();
    final pw = _loginPw.text.trim();
    final users = await _store.loadUsers();
    setState(() => _loading = false);

    if (id.isEmpty || pw.isEmpty) {
      _toast('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    if (!users.containsKey(id) || users[id] != pw) {
      _toast('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    final isAdmin = adminIds.contains(id);
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => HomePage(userId: id, isAdmin: isAdmin)),
    );
  }

  Future<void> _signup() async {
    setState(() => _loading = true);
    final id = _signupId.text.trim();
    final pw = _signupPw.text.trim();
    final users = await _store.loadUsers();

    if (id.isEmpty || pw.isEmpty) {
      setState(() => _loading = false);
      _toast('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    if (users.containsKey(id)) {
      setState(() => _loading = false);
      _toast('이미 존재하는 아이디입니다.');
      return;
    }

    users[id] = pw;
    await _store.saveUsers(users);
    setState(() => _loading = false);
    _toast('회원가입 완료! 로그인해 주세요.');
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('BOXIT 로그인'),
          bottom: const TabBar(
            tabs: [
              Tab(text: '로그인'),
              Tab(text: '회원가입'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _AuthCard(
              title: '로그인',
              children: [
                TextField(
                  controller: _loginId,
                  decoration: const InputDecoration(labelText: '아이디'),
                ),
                TextField(
                  controller: _loginPw,
                  decoration: const InputDecoration(labelText: '비밀번호'),
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: _loading ? null : _login,
                  child: _loading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('로그인'),
                ),
              ],
            ),
            _AuthCard(
              title: '회원가입',
              children: [
                TextField(
                  controller: _signupId,
                  decoration: const InputDecoration(labelText: '아이디'),
                ),
                TextField(
                  controller: _signupPw,
                  decoration: const InputDecoration(labelText: '비밀번호'),
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: _loading ? null : _signup,
                  child: _loading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('가입하기'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AuthCard extends StatelessWidget {
  const _AuthCard({
    required this.title,
    required this.children,
  });

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(title, style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 12),
                  ...children,
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.userId,
    required this.isAdmin,
  });

  final String userId;
  final bool isAdmin;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BOXIT 홈'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const AuthPage()),
              );
            },
            child: const Text('로그아웃'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('안녕하세요, $userId 님!',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(
              isAdmin ? '어드민으로 로그인됨' : '고객으로 로그인됨',
              style: TextStyle(
                color: isAdmin ? Colors.deepOrange : Colors.teal,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 24),
            if (isAdmin) ...[
              const Text('어드민 전용 메뉴',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _AdminCard(
                title: '상품 관리',
                description: '박스 상품 등록/수정/재고 관리',
              ),
              _AdminCard(
                title: '주문 관리',
                description: '주문 확인 및 출고 상태 업데이트',
              ),
            ] else ...[
              const Text('고객 메뉴',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _AdminCard(
                title: '주문 조회',
                description: '최근 주문과 배송 상태 확인',
              ),
              _AdminCard(
                title: '맞춤 견적',
                description: '박스 맞춤 제작 요청하기',
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _AdminCard extends StatelessWidget {
  const _AdminCard({
    required this.title,
    required this.description,
  });

  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(top: 10),
      child: ListTile(
        title: Text(title),
        subtitle: Text(description),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
